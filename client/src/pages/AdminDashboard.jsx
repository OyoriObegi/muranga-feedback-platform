import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FeedbackList from '../components/FeedbackList';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function AdminDashboard() {
  const { authToken } = useAuth();
  const [feedbackData, setFeedbackData] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackRes, analyticsRes] = await Promise.all([
          fetch('/api/admin/feedback', {
            headers: { Authorization: `Bearer ${authToken}` }
          }),
          fetch('/api/admin/analytics', {
            headers: { Authorization: `Bearer ${authToken}` }
          })
        ]);

        const feedback = await feedbackRes.json();
        const analyticsData = await analyticsRes.json();

        if (feedbackRes.ok) setFeedbackData(feedback);
        if (analyticsRes.ok) setAnalytics(analyticsData);
      } catch (error) {
        console.error('Dashboard load error:', error);
      }
    };

    if (authToken) fetchData();
  }, [authToken]);

  return (
    <div className="dashboard-container">
      <h1>Feedback Management Dashboard</h1>
      <AnalyticsDashboard data={analytics} />
      <FeedbackList items={feedbackData} />
    </div>
  );
}