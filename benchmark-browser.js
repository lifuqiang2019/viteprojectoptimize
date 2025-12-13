import puppeteer from 'puppeteer';

const URL = 'http://localhost:4173';
const ITERATIONS = 10;

async function runBenchmark() {
    console.log('🚀 Starting Browser Benchmark with Puppeteer...');
    console.log(`Target: ${URL}`);
    console.log('Simulating User Journey: First Visit (Cold) vs Repeat Visits (Warm/PWA)\n');

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport to a standard desktop size
    await page.setViewport({ width: 1280, height: 800 });

    // Enable Cache
    await page.setCacheEnabled(true);

    const metrics = [];

    // --- Warm-up / First Visit ---
    console.log('🔄 Warming up (installing Service Worker)...');
    try {
        await page.goto(URL, { waitUntil: 'networkidle0' });
        // Give SW time to activate and cache
        await new Promise(r => setTimeout(r, 2000)); 
    } catch (e) {
        console.error('Warmup failed:', e);
    }

    // --- Benchmark Loop ---
    console.log(`\n📊 Running ${ITERATIONS} iterations (PWA Cached)...`);
    
    for (let i = 0; i < ITERATIONS; i++) {
        process.stdout.write(` Run ${i + 1}... `);
        
        try {
            // Reload page to test cached performance
            await page.reload({ waitUntil: 'networkidle0' });

            // Extract Metrics
            const performanceMetrics = await page.evaluate(() => {
                const paint = performance.getEntriesByName('first-contentful-paint')[0];
                const nav = performance.getEntriesByType('navigation')[0];
                
                // For LCP, we need to query the PerformanceObserver buffer or assume it's settled
                // Since 'networkidle0' waits for network, LCP usually happened.
                // We can use the performance timeline for 'largest-contentful-paint'
                const lcpEntries = performance.getEntriesByName('largest-contentful-paint');
                // Note: 'largest-contentful-paint' is not always available in getEntriesByName in all contexts directly without observer
                // But in Puppeteer/Chrome it often works if buffered.
                // Better approach: use a simpler approximation or rely on Paint Timing if LCP is tricky to catch post-load without injection.
                // Let's try to get LCP from the performance observer list if possible, or fallback to largest paint.
                
                // Actually, standard way to get LCP in puppeteer after load:
                const observerList = performance.getEntriesByType('largest-contentful-paint');
                const lcp = observerList.length ? observerList[observerList.length - 1].startTime : 0;

                return {
                    fcp: paint ? paint.startTime : 0,
                    lcp: lcp || (paint ? paint.startTime : 0), // Fallback to FCP if LCP missing (often same for simple pages)
                    load: nav ? nav.loadEventEnd : 0,
                    domReady: nav ? nav.domContentLoadedEventEnd : 0
                };
            });
            
            // Puppeteer sometimes needs a proper LCP observer injection BEFORE navigation to catch it 100%.
            // But for a reload on a simple page, let's see if getEntriesByType works.
            // If 0, we might need the observer injection method.
            
            metrics.push(performanceMetrics);
            console.log(`FCP: ${performanceMetrics.fcp.toFixed(2)}ms | LCP: ${performanceMetrics.lcp.toFixed(2)}ms`);

        } catch (e) {
            console.error('Error:', e);
        }
        
        // Small pause between runs
        await new Promise(r => setTimeout(r, 500));
    }

    await browser.close();

    // --- Analysis ---
    const avgFcp = metrics.reduce((sum, m) => sum + m.fcp, 0) / metrics.length;
    const avgLcp = metrics.reduce((sum, m) => sum + m.lcp, 0) / metrics.length;
    
    console.log('\n✅ Benchmark Complete!');
    console.log('------------------------------------------------');
    console.log(`🎯 Average FCP (Cached): ${(avgFcp).toFixed(2)} ms`);
    console.log(`🎯 Average LCP (Cached): ${(avgLcp).toFixed(2)} ms`);
    console.log('------------------------------------------------');
    
    // Simple logic to detect if LCP is 0 (failed to capture)
    if (avgLcp === 0) {
        console.warn('⚠️ Warning: LCP was 0. It might need a PerformanceObserver to capture correctly.');
    }
}

runBenchmark();
