import CashierView from './cashierView';

function ManagerView({ view }: { view: string }) {  
    return (
    <div>
      <CashierView view={view} />
      {/* Add additional manager-specific components here */}
    </div>
  );
}

export default ManagerView;