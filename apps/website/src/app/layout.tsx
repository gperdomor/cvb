import './global.css';

export const metadata = {
  title: 'Welcome to cvb docs',
  description: 'Class Variance Builder documentation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
