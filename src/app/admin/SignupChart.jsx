import React from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

const data = [
    { name: 'Mon', users: 2400 },
    { name: 'Tue', users: 3100 },
    { name: 'Wed', users: 2800 },
    { name: 'Thu', users: 4200 },
    { name: 'Fri', users: 3800 },
    { name: 'Sat', users: 5100 },
    { name: 'Sun', users: 4800 },
];

const SignupChart = () => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                />
                <Tooltip 
                    contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        fontWeight: '800',
                        fontSize: '12px'
                    }}
                />
                <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#f97316" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    animationDuration={2000}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default SignupChart;
