export const MOCK_DATA = {
  student: {
    name: "Aryan Sharma",
    rollNo: "2024CS102",
    room: "B-402",
    hostel: "Vishweshwaraya Hall",
  },
  messMenu: [
    { day: "Monday", breakfast: "Poha, Tea", lunch: "Dal, Chawal, Mix Veg", dinner: "Paneer, Roti" },
    { day: "Tuesday", breakfast: "Aloo Paratha", lunch: "Rajma, Chawal", dinner: "Egg Curry / Malai Kofta" },
    { day: "Wednesday", breakfast: "Idli Sambhar", lunch: "Kadhi, Pakoda", dinner: "Chicken / Mushroom Masala" },
    { day: "Thursday", breakfast: "Oats, Milk", lunch: "Chole Bhature", dinner: "Veg Pulao, Raita" },
    { day: "Friday", breakfast: "Bread Butter", lunch: "Lauki Kofta, Dal", dinner: "Fish Curry / Soya Chaap" },
    { day: "Saturday", breakfast: "Puri Bhaji", lunch: "Khichdi, Papad", dinner: "Veg Manchurian, Fried Rice" },
    { day: "Sunday", breakfast: "Special Brunch", lunch: "Special Thali", dinner: "Biryani (Veg/Non-Veg)" },
  ],
  feeHistory: {
    hostel: [
      { id: 'H1', desc: 'Admission & Caution Deposit', date: '2024-01-05', amount: 15000, status: 'Paid', method: 'Online' },
      { id: 'H2', desc: 'Semester Accommodation Fee', date: '2024-01-05', amount: 30000, status: 'Paid', method: 'Online' },
      { id: 'H3', desc: 'Maintenance Charges', date: '2024-01-10', amount: 2000, status: 'Paid', method: 'Wallet' },
    ],
    mess: [
      { id: 'M1', desc: 'January Mess Bill', date: '2024-02-02', amount: 3500, status: 'Paid', method: 'UPI' },
      { id: 'M2', desc: 'February Mess Bill', date: '2024-03-02', amount: 3500, status: 'Paid', method: 'UPI' },
      { id: 'M3', desc: 'March Mess Bill (Partial)', date: '2024-04-01', amount: 3500, status: 'Due', method: '-' },
    ]
  }
};

