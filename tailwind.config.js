/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/site.config.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  safelist: [
    // 确保所有颜色主题的类名都被包含
    'from-purple-500/20', 'to-pink-500/20', 'border-purple-400/30', 'hover:border-purple-400/60', 'from-purple-400', 'to-pink-400',
    'from-blue-500/20', 'to-cyan-500/20', 'border-blue-400/30', 'hover:border-blue-400/60', 'from-blue-400', 'to-cyan-400',
    'from-green-500/20', 'to-emerald-500/20', 'border-green-400/30', 'hover:border-green-400/60', 'from-green-400', 'to-emerald-400',
    'from-orange-500/20', 'to-red-500/20', 'border-orange-400/30', 'hover:border-orange-400/60', 'from-orange-400', 'to-red-400',
    'from-indigo-500/20', 'to-purple-500/20', 'border-indigo-400/30', 'hover:border-indigo-400/60', 'from-indigo-400', 'to-purple-400',
    'from-teal-500/20', 'to-green-500/20', 'border-teal-400/30', 'hover:border-teal-400/60', 'from-teal-400', 'to-green-400',
    'from-rose-500/20', 'to-pink-500/20', 'border-rose-400/30', 'hover:border-rose-400/60', 'from-rose-400', 'to-pink-400',
    'from-amber-500/20', 'to-orange-500/20', 'border-amber-400/30', 'hover:border-amber-400/60', 'from-amber-400', 'to-orange-400',
    // 预览颜色
    'bg-gradient-to-r', 'from-purple-500', 'to-pink-500', 'from-blue-500', 'to-cyan-500',
    'from-green-500', 'to-emerald-500', 'from-orange-500', 'to-red-500',
    'from-indigo-500', 'to-purple-500', 'from-teal-500', 'to-green-500',
    'from-rose-500', 'to-pink-500', 'from-amber-500', 'to-orange-500'
  ]
}