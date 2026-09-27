import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import type { TableRow } from '../TableView';

const axisTickStyle = {
  fill: 'var(--component-text-gray)',
  fontFamily: 'var(--second-family)',
  fontWeight: 400,
  fontSize: '0.8125rem',
  lineHeight: '150%',
}

interface ChartViewProps {
  type: 'line' | 'bar';
  data: TableRow[];
  isCompactDateLabels?: boolean;
}

function ChartView({ data, type, isCompactDateLabels = false }: ChartViewProps) {
  const chartData = data.map(({ rowHeading, dataSlots }) => ({
    label: rowHeading,
    value: Number(dataSlots[0]),
  }));

  function formatXAxisLabel(label: string, labelIndex: number) {
    if (!isCompactDateLabels || labelIndex === 0) {
      return label;
    }

    return label.split(' ')[0];
  }

  return (
    <ResponsiveContainer>
      {type === 'line' ? (
        <LineChart data={chartData}>
          <Line
            activeDot={false}
            dataKey='value'
            dot={false}
            stroke='var(--component-stroke-dark)'
            strokeWidth={4}
          />
          <CartesianGrid
            vertical={false}
            stroke='var(--component-stroke-dark-soft)'
          />
          <XAxis
            axisLine={false}
            dataKey='label'
            interval='preserveStartEnd'
            minTickGap={8}
            padding={{ left: 24, right: 12 }}
            tick={axisTickStyle}
            tickFormatter={formatXAxisLabel}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            domain={[0, 'dataMax']}
            tick={{ ...axisTickStyle, dy: 10 }}
            mirror={true}
            padding={{ bottom: 50 }}
            tickLine={false}
          />
        </LineChart>
      ) : (
        <BarChart data={chartData}>
          <Bar
            dataKey='value'
            fill='var(--component-fill-dark)'
          />
          <CartesianGrid
            vertical={false}
            stroke='var(--component-stroke-dark-soft)'
          />
          <XAxis
            axisLine={false}
            dataKey='label'
            interval='preserveStartEnd'
            minTickGap={8}
            padding={{ left: 32, right: 32 }}
            tick={axisTickStyle}
            tickFormatter={formatXAxisLabel}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            domain={[0, 'dataMax']}
            tick={{ ...axisTickStyle, dy: 10 }}
            mirror={true}
            padding={{ bottom: 50 }}
            tickLine={false}
          />
        </BarChart>
      )
      }
    </ResponsiveContainer>
  );
}

export default ChartView;
