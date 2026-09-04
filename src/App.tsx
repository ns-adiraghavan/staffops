import { AppProvider, useApp } from './app-context';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './screens/Dashboard';
import { Requirements } from './screens/Requirements';
import { RequirementDetail } from './screens/RequirementDetail';
import { Vendors } from './screens/Vendors';
import { VendorUpload } from './screens/VendorUpload';
import { RateCard } from './screens/RateCard';
import { Generate } from './screens/Generate';
import { Documents } from './screens/Documents';

function Screen() {
  const { route } = useApp();
  switch (route.name) {
    case 'requirements': return <Requirements />;
    case 'reqDetail': return <RequirementDetail />;
    case 'vendors': return <Vendors />;
    case 'upload': return <VendorUpload />;
    case 'ratecard': return <RateCard />;
    case 'generate': return <Generate />;
    case 'documents': return <Documents />;
    default: return <Dashboard />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="shell">
        <Sidebar />
        <div className="main">
          <Screen />
        </div>
      </div>
    </AppProvider>
  );
}
