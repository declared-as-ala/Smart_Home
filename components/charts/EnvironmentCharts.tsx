import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '@/contexts/ThemeContext';

type ChartData = {
  temperature: number[];
  humidity: number[];
  gas: number[];
  labels: string[];
};

type Props = {
  data: ChartData;
};

export default function EnvironmentCharts({ data }: Props) {
  const { colors, isDarkMode } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  
  // Calculate responsive widths
  const chartWidth = Math.min(windowWidth - 40, 600); // Max width of 600px
  const pieChartWidth = Math.min((windowWidth - 80) / 3, 200); // Max width of 200px per pie chart, 3 charts in a row
  
  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(8, 145, 178, ${opacity})`,
    labelColor: () => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Environmental Monitoring</Text>
      
      <View style={styles.pieChartsContainer}>
        <View style={[styles.pieChartWrapper, { width: pieChartWidth }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Temperature</Text>
          <PieChart
            data={[{
              name: 'Current',
              value: data.temperature[data.temperature.length - 1],
              color: '#F59E0B',
              legendFontColor: colors.text,
            }]}
            width={pieChartWidth}
            height={pieChartWidth}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            center={[pieChartWidth / 4, 0]}
          />
          <Text style={[styles.pieValue, { color: colors.text }]}>
            {data.temperature[data.temperature.length - 1]}°C
          </Text>
        </View>

        <View style={[styles.pieChartWrapper, { width: pieChartWidth }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Humidity</Text>
          <PieChart
            data={[{
              name: 'Current',
              value: data.humidity[data.humidity.length - 1],
              color: '#0891B2',
              legendFontColor: colors.text,
            }]}
            width={pieChartWidth}
            height={pieChartWidth}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            center={[pieChartWidth / 4, 0]}
          />
          <Text style={[styles.pieValue, { color: colors.text }]}>
            {data.humidity[data.humidity.length - 1]}%
          </Text>
        </View>

        <View style={[styles.pieChartWrapper, { width: pieChartWidth }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Gas Level</Text>
          <PieChart
            data={[{
              name: 'Current',
              value: data.gas[data.gas.length - 1],
              color: '#10B981',
              legendFontColor: colors.text,
            }]}
            width={pieChartWidth}
            height={pieChartWidth}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            center={[pieChartWidth / 4, 0]}
          />
          <Text style={[styles.pieValue, { color: colors.text }]}>
            Level {data.gas[data.gas.length - 1]}
          </Text>
        </View>
      </View>

      <View style={[styles.chartContainer, { width: chartWidth }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>24-Hour Trends</Text>
        <LineChart
          data={{
            labels: data.labels,
            datasets: [
              { data: data.temperature, color: () => '#F59E0B' },
              { data: data.humidity, color: () => '#0891B2' },
              { data: data.gas, color: () => '#10B981' },
            ],
            legend: ['Temperature', 'Humidity', 'Gas']
          }}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  pieChartsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  pieChartWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  pieValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
});