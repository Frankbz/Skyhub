import styles from "./BarChart.module.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
);


const BarChart = ({from, to, spending}) => {
  const monthDictionary = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const formatDate = (date) => {
    const options = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const generateLabels = (from, to) => {
    let labels = []
    let currentDate = new Date(from);
    while (currentDate < new Date(to) || currentDate.getMonth() === new Date(to).getMonth()) {
      labels.push(formatDate(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return labels;
  }

  // Generate labels and initialize data array
  const labels = generateLabels(from, to);
  const d = Array(labels.length).fill(0);

  // Update data array based on spending values
  spending.forEach(({ month, monthly_sum, year }) => {
    const element = monthDictionary[month] + ' ' + year.toString()
    const index = labels.indexOf(element)
    d[index] = monthly_sum
    
  });

  const data = {
    labels,
    datasets: [
      {
        data: d,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
          display: false,
      },
      tooltip: {
          callbacks: {
              label: function (context) {
                  return `Spent ${context.raw} dollars`;
              },
          },
          displayColors: false,
      },
  },
  };
  const sum = d.reduce((acc, value) => acc + value, 0);

  return ( 
    <div className={styles.contain}>
      <div className={styles.title}>
        <div className={styles.word1}>Total Spending: ${sum}</div>
        <div className={styles.word2}>{from} - {to}</div>
      </div>
      <div className={styles.bar}>
        <Bar options={options} data={data} />
      </div>
    </div>
  
  
  );
}
 
export default BarChart;
