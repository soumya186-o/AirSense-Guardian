// frontend/src/components/HealthRiskPanel.js
import React from 'react';

const RISK_GROUPS = [
  {
    id: 'children',
    label: 'Children (0–12 yrs)',
    icon: '🧒',
    sensitivity: 1.4,
    tips: {
      good: 'Safe for outdoor play.',
      moderate: 'Limit prolonged outdoor activity.',
      unhealthy_sensitive: 'Avoid outdoor physical activity.',
      unhealthy: 'Keep indoors. Use air purifier.',
      very_unhealthy: 'Do not go outside. Wear N95 if essential.',
      hazardous: 'Emergency risk. Stay indoors, seal windows.',
    },
  },
  {
    id: 'elderly',
    label: 'Elderly (60+ yrs)',
    icon: '👴',
    sensitivity: 1.3,
    tips: {
      good: 'Normal outdoor activities are fine.',
      moderate: 'Monitor for symptoms like breathlessness.',
      unhealthy_sensitive: 'Avoid strenuous outdoor exertion.',
      unhealthy: 'Stay indoors when possible.',
      very_unhealthy: 'Avoid all outdoor activity. Consult doctor if symptoms appear.',
      hazardous: 'Severe health risk. Stay indoors, seek medical attention if needed.',
    },
  },
  {
    id: 'asthma',
    label: 'Asthma Patients',
    icon: '🫁',
    sensitivity: 1.6,
    tips: {
      good: 'Safe. Keep rescue inhaler handy as always.',
      moderate: 'Carry inhaler. Avoid heavy exercise outdoors.',
      unhealthy_sensitive: 'High risk of attack. Stay indoors, use inhaler as prescribed.',
      unhealthy: 'Do not go outside. Pre-medicate if doctor advised.',
      very_unhealthy: 'Serious risk of severe attack. Do not leave home.',
      hazardous: 'Life-threatening. Emergency precautions. Call doctor immediately.',
    },
  },
];

function getAQICategory(aqi) {
  if (aqi <= 50) return { key: 'good', label: 'Good', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
  if (aqi <= 100) return { key: 'moderate', label: 'Moderate', color: '#eab308', bg: 'rgba(234,179,8,0.12)' };
  if (aqi <= 150) return { key: 'unhealthy_sensitive', label: 'Unhealthy for Sensitive', color: '#f97316', bg: 'rgba(249,115,22,0.12)' };
  if (aqi <= 200) return { key: 'unhealthy', label: 'Unhealthy', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
  if (aqi <= 300) return { key: 'very_unhealthy', label: 'Very Unhealthy', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' };
  return { key: 'hazardous', label: 'Hazardous', color: '#7f1d1d', bg: 'rgba(127,29,29,0.15)' };
}

function getRiskLevel(aqi, sensitivity) {
  const adjusted = aqi * sensitivity;
  if (adjusted <= 50) return { level: 'Low', color: '#22c55e', width: '20%' };
  if (adjusted <= 120) return { level: 'Moderate', color: '#eab308', width: '40%' };
  if (adjusted <= 200) return { level: 'High', color: '#f97316', width: '65%' };
  if (adjusted <= 300) return { level: 'Very High', color: '#ef4444', width: '80%' };
  return { level: 'Severe', color: '#7f1d1d', width: '100%' };
}

const HealthRiskPanel = ({ aqi = 0 }) => {
  const category = getAQICategory(aqi);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255,255,255,0.1)',
      marginTop: '20px',
    }}>
      <h3 style={{ color: '#fff', margin: '0 0 6px 0', fontSize: '1.1rem' }}>
        🏥 Health Risk by Group
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 16px 0' }}>
        Based on current AQI: <strong style={{ color: category.color }}>{aqi} — {category.label}</strong>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {RISK_GROUPS.map((group) => {
          const risk = getRiskLevel(aqi, group.sensitivity);
          const tip = group.tips[category.key];
          return (
            <div key={group.id} style={{
              background: category.bg,
              borderRadius: '10px',
              padding: '14px 16px',
              border: `1px solid ${category.color}33`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>
                  {group.icon} {group.label}
                </span>
                <span style={{
                  background: risk.color + '22',
                  color: risk.color,
                  borderRadius: '20px',
                  padding: '2px 10px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  border: `1px solid ${risk.color}55`,
                }}>
                  {risk.level} Risk
                </span>
              </div>

              {/* Risk bar */}
              <div style={{
                height: '5px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                overflow: 'hidden',
                marginBottom: '8px',
              }}>
                <div style={{
                  height: '100%',
                  width: risk.width,
                  background: risk.color,
                  borderRadius: '10px',
                  transition: 'width 0.6s ease',
                }} />
              </div>

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', margin: 0 }}>
                💡 {tip}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthRiskPanel;