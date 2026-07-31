export default function MissionProgress({ missions }) {
  const completeCount = missions.filter((m) => m.status === 'complete').length
  const activeIndex = missions.findIndex((m) => m.status === 'active')

  return (
    <div style={{ margin: '20px 0 6px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          mission progress
        </span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
          {completeCount} of {missions.length} complete
        </span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {missions.map((m, i) => {
          const filled = m.status === 'complete' ? 1 : m.status === 'active' ? 0.4 : 0
          const color = m.status === 'complete' ? 'var(--teal)' : m.status === 'active' ? 'var(--amber)' : 'var(--surface-3)'
          return (
            <div
              key={m.id}
              style={{
                flex: 1,
                height: 5,
                borderRadius: 3,
                background: 'var(--surface-1)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${filled * 100}%`,
                  height: '100%',
                  background: color,
                  transition: 'width 400ms ease',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
