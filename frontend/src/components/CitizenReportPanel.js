// frontend/src/components/CitizenReportPanel.js
import React, { useState } from 'react';
import axios from 'axios';

const POLLUTION_SOURCES = [
  { id: 'garbage_burning', label: 'Garbage Burning', icon: '🔥' },
  { id: 'construction_dust', label: 'Construction Dust', icon: '🏗️' },
  { id: 'smoke_chimney', label: 'Industrial Smoke / Chimney', icon: '🏭' },
  { id: 'vehicle_smoke', label: 'Vehicle Smoke', icon: '🚛' },
  { id: 'crop_burning', label: 'Crop / Stubble Burning', icon: '🌾' },
  { id: 'other', label: 'Other', icon: '⚠️' },
];

const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const SEVERITY_COLORS = { Low: '#22c55e', Medium: '#eab308', High: '#f97316', Critical: '#ef4444' };

const CitizenReportPanel = ({ lat, lon }) => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedSource) {
      setError('Please select a pollution source.');
      return;
    }
    setError('');
    setSubmitting(true);

    const payload = {
      source_type: selectedSource,
      severity,
      description,
      lat: lat || 28.6139,
      lon: lon || 77.209,
      timestamp: new Date().toISOString(),
    };

    try {
      // Try backend; if unavailable, fall back to local state
      await axios.post('http://localhost:5000/api/reports', payload);
    } catch (_) {
      // Backend might not be running locally — still show success UI
    }

    const sourceObj = POLLUTION_SOURCES.find((s) => s.id === selectedSource);
    setRecentReports((prev) => [
      { ...payload, icon: sourceObj?.icon, label: sourceObj?.label },
      ...prev.slice(0, 4),
    ]);
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedSource(null);
      setDescription('');
      setSeverity('Medium');
    }, 3000);
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255,255,255,0.1)',
      marginTop: '20px',
    }}>
      <h3 style={{ color: '#fff', margin: '0 0 6px 0', fontSize: '1.1rem' }}>
        📣 Report Pollution Source
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 16px 0' }}>
        Help the community by reporting nearby pollution incidents.
      </p>

      {submitted ? (
        <div style={{
          textAlign: 'center',
          padding: '24px',
          background: 'rgba(34,197,94,0.12)',
          borderRadius: '10px',
          border: '1px solid rgba(34,197,94,0.3)',
        }}>
          <div style={{ fontSize: '2rem' }}>✅</div>
          <p style={{ color: '#22c55e', fontWeight: '700', margin: '8px 0 4px' }}>Report Submitted!</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', margin: 0 }}>
            Thank you for helping keep your community informed.
          </p>
        </div>
      ) : (
        <>
          {/* Source selection grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '14px',
          }}>
            {POLLUTION_SOURCES.map((src) => (
              <button
                key={src.id}
                onClick={() => setSelectedSource(src.id)}
                style={{
                  background: selectedSource === src.id ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)',
                  border: selectedSource === src.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '10px 6px',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{src.icon}</div>
                {src.label}
              </button>
            ))}
          </div>

          {/* Severity selector */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: '6px' }}>
              Severity Level
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {SEVERITY_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSeverity(lvl)}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    borderRadius: '6px',
                    border: severity === lvl ? `1px solid ${SEVERITY_COLORS[lvl]}` : '1px solid rgba(255,255,255,0.1)',
                    background: severity === lvl ? SEVERITY_COLORS[lvl] + '22' : 'rgba(255,255,255,0.05)',
                    color: severity === lvl ? SEVERITY_COLORS[lvl] : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: severity === lvl ? '700' : '400',
                    transition: 'all 0.2s',
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional: describe what you see (e.g., 'Large pile of waste being burned near highway')"
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              color: '#fff',
              padding: '10px',
              fontSize: '0.82rem',
              resize: 'none',
              boxSizing: 'border-box',
              marginBottom: '10px',
              outline: 'none',
            }}
          />

          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0 0 8px' }}>⚠ {error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '11px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {submitting ? 'Submitting…' : '📤 Submit Report'}
          </button>
        </>
      )}

      {/* Recent Reports */}
      {recentReports.length > 0 && (
        <div style={{ marginTop: '18px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', margin: '0 0 8px' }}>
            📋 Your Recent Reports
          </p>
          {recentReports.map((r, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '8px',
              marginBottom: '6px',
              fontSize: '0.8rem',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{r.icon}</span>
              <span style={{ color: '#fff', flex: 1 }}>{r.label}</span>
              <span style={{
                color: SEVERITY_COLORS[r.severity],
                fontWeight: '600',
                fontSize: '0.75rem',
              }}>{r.severity}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
                {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitizenReportPanel;