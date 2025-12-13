import http from 'http';
import { performance } from 'perf_hooks';

const URL = 'http://localhost:4173/assets/vendor-CiubxYTN.js';
const ITERATIONS = 10;

function runRequest(useGzip) {
    return new Promise((resolve, reject) => {
        const start = performance.now();
        const options = {
            headers: useGzip ? { 'Accept-Encoding': 'gzip' } : { 'Accept-Encoding': 'identity' }
        };

        http.get(URL, options, (res) => {
            let dataLength = 0;
            res.on('data', (chunk) => dataLength += chunk.length);
            res.on('end', () => {
                const duration = performance.now() - start;
                resolve({ duration, size: dataLength });
            });
        }).on('error', reject);
    });
}

async function benchmark() {
    console.log(`Starting Benchmark: ${ITERATIONS} iterations per scenario...`);
    console.log(`Target: ${URL}\n`);

    // Scenario 1: Without Gzip
    let totalTimeNoGzip = 0;
    let totalSizeNoGzip = 0;
    const resultsNoGzip = [];
    
    console.log('--- Scenario 1: Without Gzip (Simulating Unoptimized Transfer) ---');
    for (let i = 0; i < ITERATIONS; i++) {
        const { duration, size } = await runRequest(false);
        resultsNoGzip.push(duration);
        totalTimeNoGzip += duration;
        totalSizeNoGzip = size; // Should be constant
        process.stdout.write('.');
    }
    console.log('\n');

    // Scenario 2: With Gzip
    let totalTimeGzip = 0;
    let totalSizeGzip = 0;
    const resultsGzip = [];

    console.log('--- Scenario 2: With Gzip (Simulating Optimized Transfer) ---');
    for (let i = 0; i < ITERATIONS; i++) {
        const { duration, size } = await runRequest(true);
        resultsGzip.push(duration);
        totalTimeGzip += duration;
        totalSizeGzip = size; // Should be constant
        process.stdout.write('.');
    }
    console.log('\n');

    // Stats
    const avgSizeNoGzip = totalSizeNoGzip; // Size is constant per request usually
    const avgSizeGzip = totalSizeGzip;

    // Network Simulation Constants
    const NETWORK_SPEED_4G = 1.6 * 1024 * 1024 / 8; // 1.6 Mbps in bytes/sec (Lighthouse Slow 4G)
    
    const timeNoGzip4G = (avgSizeNoGzip / NETWORK_SPEED_4G) * 1000; // ms
    const timeGzip4G = (avgSizeGzip / NETWORK_SPEED_4G) * 1000; // ms

    console.log('📊 Benchmark Results (10 Requests Average):');
    console.log('------------------------------------------------');
    console.log(`❌ Without Gzip (Optimization Before):`);
    console.log(`   Transfer Size: ${(avgSizeNoGzip / 1024).toFixed(2)} kB`);
    console.log(`   Projected Load Time (Slow 4G): ${(timeNoGzip4G / 1000).toFixed(2)} s`);
    
    console.log(`\n✅ With Gzip (Optimization After):`);
    console.log(`   Transfer Size: ${(avgSizeGzip / 1024).toFixed(2)} kB`);
    console.log(`   Projected Load Time (Slow 4G): ${(timeGzip4G / 1000).toFixed(2)} s`);

    console.log('\n🚀 Performance Improvement:');
    console.log(`   Size Reduction: ${((1 - avgSizeGzip/avgSizeNoGzip) * 100).toFixed(1)}%`);
    console.log(`   Time Saved (Slow 4G): ${((timeNoGzip4G - timeGzip4G) / 1000).toFixed(2)} s`);
    console.log(`   Speedup Factor: ${ (timeNoGzip4G / timeGzip4G).toFixed(1) }x faster`);
}

benchmark();
