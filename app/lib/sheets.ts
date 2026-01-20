import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

export async function getSheetData(range: string) {
    try {
        // 1. Auth: Using API Key (simplest for public/read-only) 
        // OR Service Account (for private sheets). 
        // We'll set this up to work with an API Key for now as it's easier for the user.

        // Check if we have credentials
        const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!apiKey || !sheetId) {
            console.warn("Missing Google Sheets Credentials");
            return [];
        }

        const sheets = google.sheets({ version: 'v4', auth: apiKey });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: range,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.warn('No data found.');
            return [];
        }

        // Transform rows (Arrays) into Objects based on header row
        const headers = rows[0];
        const data = rows.slice(1).map((row) => {
            let obj: Record<string, string> = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || ''; // Handle empty cells
            });
            return obj;
        });

        return data;

    } catch (error) {
        console.error('Error fetching sheet data:', error);
        return [];
    }
}
