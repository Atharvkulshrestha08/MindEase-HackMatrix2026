import { useState, useEffect, useRef } from 'react'
import Papa from 'papaparse'
import { animate, utils } from 'animejs'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { PieChart as PieIcon, Activity, Users } from 'lucide-react'
import Card from '../components/ui/Card'

// Import CSV data as raw strings
import prevalenceCsv from '../data/csv/prevalence.csv?raw'
import gapCsv from '../data/csv/treatment-gap.csv?raw'
import symptomsCsv from '../data/csv/symptoms.csv?raw'

const COLORS = ['#00ad54', '#813588', '#f39c12', '#e74c3c', '#3498db', '#1abc9c']

const DataExplorer = () => {
  const [prevalenceData, setPrevalenceData] = useState([])
  const [gapData, setGapData] = useState([])
  const [symptomsData, setSymptomsData] = useState([])
  const containerRef = useRef(null)

  useEffect(() => {
    // Parse Prevalence Data (Filter for World, latest years)
    Papa.parse(prevalenceCsv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Filter for global data from 1990 to 2019
        const worldData = results.data.filter(d => d.Entity === 'World')
        const formatted = worldData.map(d => ({
          year: d.Year,
          Depression: parseFloat(d['Depressive disorders (share of population) - Sex: Both - Age: Age-standardized']) || 0,
          Anxiety: parseFloat(d['Anxiety disorders (share of population) - Sex: Both - Age: Age-standardized']) || 0,
          Bipolar: parseFloat(d['Bipolar disorders (share of population) - Sex: Both - Age: Age-standardized']) || 0,
          Schizophrenia: parseFloat(d['Schizophrenia disorders (share of population) - Sex: Both - Age: Age-standardized']) || 0,
        }))
        setPrevalenceData(formatted)
      }
    })

    // Parse Treatment Gap Data
    Papa.parse(gapCsv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const formatted = results.data.map(d => ({
          name: d.Entity,
          'Adequate Treatment': parseFloat(d['Potentially adequate treatment, conditional']) || 0,
          'Other Treatments': parseFloat(d['Other treatments, conditional']) || 0,
          'Untreated': parseFloat(d['Untreated, conditional']) || 0,
        }))
        // Sort by untreated descending
        setGapData(formatted.sort((a, b) => b.Untreated - a.Untreated))
      }
    })

    // Parse Symptoms Data
    Papa.parse(symptomsCsv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Find the "Average across symptoms" row for a pie chart
        const avgRow = results.data.find(d => d.Entity === 'Average across symptoms')
        if (avgRow) {
          setSymptomsData([
            { name: 'Nearly every day', value: parseFloat(avgRow['Nearly every day']) },
            { name: 'More than half the days', value: parseFloat(avgRow['More than half the days']) },
            { name: 'Several days', value: parseFloat(avgRow['Several days']) },
            { name: 'Not at all', value: parseFloat(avgRow['Not at all']) },
          ])
        }
      }
    })
  }, [])

  // Anime.js entrance animation
  useEffect(() => {
    if (prevalenceData.length > 0 && containerRef.current) {
      animate('.chart-card', {
        y: [30, 0],
        opacity: [0, 1],
        delay: utils.stagger(150),
        duration: 800,
        ease: 'outCubic'
      })
    }
  }, [prevalenceData])

  return (
    <div className="max-w-6xl mx-auto" ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
          <PieIcon size={36} style={{ color: 'var(--primary)' }} />
          Data Explorer
        </h1>
        <p className="text-lg" style={{ color: 'var(--on-surface-variant)' }}>
          Explore interactive global statistics on mental health prevalence, symptoms, and treatment gaps.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Global Prevalence Chart */}
        <Card padding="lg" className="chart-card opacity-0 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={24} style={{ color: 'var(--primary)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--on-surface)' }}>Global Prevalence Over Time (1990 - 2019)</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prevalenceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" />
                <XAxis dataKey="year" stroke="var(--on-surface-variant)" />
                <YAxis stroke="var(--on-surface-variant)" unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}
                  itemStyle={{ color: 'var(--on-surface)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Depression" stroke={COLORS[0]} strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Anxiety" stroke={COLORS[1]} strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="Bipolar" stroke={COLORS[2]} strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="Schizophrenia" stroke={COLORS[3]} strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Treatment Gap Chart */}
        <Card padding="lg" className="chart-card opacity-0">
          <div className="flex items-center gap-2 mb-6">
            <Users size={24} style={{ color: 'var(--secondary)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--on-surface)' }}>Anxiety Treatment Gap by Country</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--on-surface-variant)" angle={-45} textAnchor="end" height={80} interval={0} tick={{fontSize: 10}} />
                <YAxis stroke="var(--on-surface-variant)" unit="%" />
                <Tooltip 
                  cursor={{ fill: 'var(--surface-container)' }}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="Adequate Treatment" stackId="a" fill={COLORS[0]} />
                <Bar dataKey="Other Treatments" stackId="a" fill={COLORS[2]} />
                <Bar dataKey="Untreated" stackId="a" fill={COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Symptoms Pie Chart */}
        <Card padding="lg" className="chart-card opacity-0">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon size={24} style={{ color: 'var(--tertiary)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--on-surface)' }}>Frequency of Depressive Symptoms (US)</h2>
          </div>
          <div className="h-80 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={symptomsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {symptomsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  )
}

export default DataExplorer
