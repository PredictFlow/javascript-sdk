import {
  PredictFlow,
  type ScheduledReport,
} from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  console.log('=== PredictFlow Data Exports & Scheduled Automated Reports ===\n');

  // STEP 1: Find a store
  const stores = await predictFlow.stores.list();
  if (stores.length === 0) {
    console.log('No stores found. Please run stores example first.');
    return;
  }

  const targetStore = stores[0];
  if (!targetStore) {
    console.log('No stores found. Please run stores example first.');
    return;
  }
  console.log(`Target Store: "${targetStore.name}" (ID: ${targetStore.id})\n`);

  // STEP 2: Export Products Catalog CSV
  console.log('1. Exporting Store Products Catalog (CSV)...');
  const productsCsv = await predictFlow.exports.exportProducts(targetStore.id, { format: 'csv' });
  const productCsvLines = productsCsv.trim().split('\n');
  console.log(`✅ Received Products CSV (${productCsvLines.length} lines, first line: "${productCsvLines[0]}")\n`);

  // STEP 3: Export Sales History CSV
  console.log('2. Exporting Store Sales History (CSV, 90 days)...');
  const salesCsv = await predictFlow.exports.exportSales(targetStore.id, { format: 'csv', days: 90 });
  const salesCsvLines = salesCsv.trim().split('\n');
  console.log(`✅ Received Sales CSV (${salesCsvLines.length} lines, first line: "${salesCsvLines[0]}")\n`);

  // STEP 4: Export Inventory Stock Levels CSV
  console.log('3. Exporting Store Inventory & Stock Projections (CSV)...');
  const inventoryCsv = await predictFlow.exports.exportInventory(targetStore.id, { format: 'csv', days: 30 });
  const invCsvLines = inventoryCsv.trim().split('\n');
  console.log(`✅ Received Inventory CSV (${invCsvLines.length} lines, first line: "${invCsvLines[0]}")\n`);

  // STEP 5: Export Demand Forecasts CSV
  console.log('4. Exporting Generated Demand Forecasts (CSV)...');
  const forecastsCsv = await predictFlow.exports.exportForecasts(targetStore.id, { format: 'csv', duration_days: 90 });
  const fcCsvLines = forecastsCsv.trim().split('\n');
  console.log(`✅ Received Forecasts CSV (${fcCsvLines.length} lines, first line: "${fcCsvLines[0]}")\n`);

  // STEP 6: Export Reorder Recommendations CSV
  console.log('5. Exporting Automated Reorder Batches (CSV)...');
  const reorderCsv = await predictFlow.exports.exportReorder(targetStore.id, { format: 'csv' });
  const reorderCsvLines = reorderCsv.trim().split('\n');
  console.log(`✅ Received Reorder CSV (${reorderCsvLines.length} lines, first line: "${reorderCsvLines[0]}")\n`);

  // STEP 7: Export Dead Stock Liquidation Report CSV
  console.log('6. Exporting Dead Stock Liquidation Report (CSV)...');
  const deadStockCsv = await predictFlow.exports.exportDeadStock(targetStore.id, { format: 'csv' });
  const deadStockLines = deadStockCsv.trim().split('\n');
  console.log(`✅ Received Dead Stock CSV (${deadStockLines.length} lines, first line: "${deadStockLines[0]}")\n`);

  // STEP 8: Export Account-wide Dashboard Summary CSV
  console.log('7. Exporting Full Account Executive Dashboard (CSV, 30 days)...');
  const dashboardCsv = await predictFlow.exports.exportDashboard({ format: 'csv', days: 30 });
  const dashLines = dashboardCsv.trim().split('\n');
  console.log(`✅ Received Dashboard CSV (${dashLines.length} lines, first line: "${dashLines[0]}")\n`);

  // STEP 9: Clean up any old duplicate test reports first
  const existingReports = await predictFlow.exports.listScheduledReports(targetStore.id);
  for (const r of existingReports) {
    if (r.report_type === 'inventory') {
      try {
        await predictFlow.exports.deleteScheduledReport(r.id);
      } catch {}
    }
  }

  // STEP 10: Schedule Automated Weekly Email Report
  console.log('8. Configuring Scheduled Weekly Inventory Report...');
  const scheduledReport: ScheduledReport = await predictFlow.exports.createScheduledReport(targetStore.id, {
    report_type: 'inventory',
    cadence: 'weekly',
    format: 'csv',
    is_active: true,
  });

  console.log(`✅ Created Scheduled Report (ID: ${scheduledReport.id}):`);
  console.log(`   - Report Type:  ${scheduledReport.report_type}`);
  console.log(`   - Cadence:      ${scheduledReport.cadence}`);
  console.log(`   - Format:       ${scheduledReport.format}`);
  console.log(`   - Active:       ${scheduledReport.is_active}\n`);

  // STEP 11: List Scheduled Reports
  console.log('9. Listing all Scheduled Reports for store...');
  const reportsList = await predictFlow.exports.listScheduledReports(targetStore.id);
  console.log(`✅ Active Scheduled Reports (${reportsList.length}):`);
  for (const r of reportsList) {
    console.log(`   - [${r.id}] ${r.report_type.toUpperCase()} (${r.cadence}, format: ${r.format}, active: ${r.is_active})`);
  }
  console.log('');

  // STEP 12: Update Scheduled Report
  console.log('10. Updating Scheduled Report (toggling active status)...');
  const updatedReport = await predictFlow.exports.updateScheduledReport(scheduledReport.id, {
    is_active: false,
  });
  console.log(`✅ Updated Scheduled Report: is_active is now ${updatedReport.is_active}\n`);

  // STEP 13: Trigger Test Report Generation / Delivery
  console.log('11. Triggering On-Demand Report Delivery ("Send Report Now")...');
  try {
    const sentReport = await predictFlow.exports.sendReportNow(scheduledReport.id);
    console.log(`✅ Report Dispatched! Last sent timestamp: ${sentReport.last_sent_at}\n`);
  } catch (err: any) {
    console.log(`ℹ️ Email Dispatch note: ${err.message} (Expected when SMTP/Brevo is unconfigured in local dev)\n`);
  }

  // STEP 14: Cleanup Scheduled Report
  console.log('12. Cleaning up test scheduled report...');
  await predictFlow.exports.deleteScheduledReport(scheduledReport.id);
  console.log('✅ Deleted scheduled report successfully.\n');

  console.log('🎉 All Export and Scheduled Report operations executed successfully!');
}

main().catch((err) => {
  console.error('❌ Exports Operations Error:', err);
});
