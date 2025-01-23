import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Label
} from 'recharts';
import { TrendingUp, Users, BookOpen, Video, Clock } from 'lucide-react';
import API from "@/services/api";

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState({
        overview: {
            totalCourses: 0,
            totalLectures: 0,
            totalUsers: 0,
            averageWatchTime: '0'
        },
        userGrowth: [],
        courseStats: [],
        popularCourses: [],
        performanceMetrics: {
            mostPopularCourse: null,
            highestCompletionRate: { courseName: '', rate: '0%' },
            averageRating: 0
        }
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/analytics', {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            setAnalyticsData(data.data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, trend }) => (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                    <Icon className="h-6 w-6 text-purple-600" />
                </div>
            </div>
            {trend && (
                <div className="flex items-center mt-4 text-green-500 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{trend}% increase from last month</span>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="p-2 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
                <p className="text-gray-500">Detailed insights about your courses and students</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Students"
                    value={analyticsData.overview.totalUsers}
                    icon={Users}
                    trend={12}
                />
                <StatCard
                    title="Total Courses"
                    value={analyticsData.overview.totalCourses}
                    icon={BookOpen}
                    trend={8}
                />
                <StatCard
                    title="Total Lectures"
                    value={analyticsData.overview.totalLectures}
                    icon={Video}
                    trend={15}
                />
                <StatCard
                    title="Avg. Watch Time"
                    value={analyticsData.overview.averageWatchTime}
                    icon={Clock}
                    trend={5}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student Growth Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Student Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="students"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Course Statistics */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Course Statistics</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.courseStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="courses" fill="#8b5cf6" />
                            <Bar dataKey="completion" fill="#22c55e" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>


            {/* Revenue and Enrollment Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Revenue & Enrollment Statistics</h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Enrollments</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Revenue ($)</span>
                        </div>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={analyticsData.revenueStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6">
                            <Label
                                value="Enrollments"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle' }}
                            />
                        </YAxis>
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#22c55e"
                            tickFormatter={(value) => `$${value}`}
                        >
                            <Label
                                value="Revenue"
                                angle={90}
                                position="insideRight"
                                style={{ textAnchor: 'middle' }}
                            />
                        </YAxis>
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === 'revenue') return [`$${value}`, 'Revenue'];
                                return [value, 'Enrollments'];
                            }}
                        />
                        <Legend />
                        <Bar
                            yAxisId="left"
                            dataKey="enrollments"
                            fill="#8b5cf6"
                            name="Enrollments"
                            radius={[4, 4, 0, 0]}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            stroke="#22c55e"
                            strokeWidth={2}
                            name="Revenue"
                            dot={{ r: 4 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-purple-600">Total Enrollments</h4>
                        <p className="text-2xl font-bold text-purple-700 mt-1">
                            {analyticsData.revenueStats.reduce((acc, curr) => acc + curr.enrollments, 0)}
                        </p>
                        <p className="text-sm text-purple-600 mt-1">Last 6 months</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-green-600">Total Revenue</h4>
                        <p className="text-2xl font-bold text-green-700 mt-1">
                            ${analyticsData.revenueStats.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-green-600 mt-1">Last 6 months</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Analytics; 