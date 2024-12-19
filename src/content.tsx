import ReactDOM from 'react-dom/client';
import App from './App';

const appId = 'meetup-batch-event-set';

const injectApp = (mainLayout: Element) => {
  if (mainLayout) {
    const column3 = mainLayout.children[2] as HTMLElement;
    column3.style.display = 'none';
    const block_to_insert = document.createElement('div');
    block_to_insert.id = appId;

    mainLayout.appendChild(block_to_insert);

    const root = ReactDOM.createRoot(block_to_insert);
    root.render(<App />);
  }
};

// Observer to detect changes in the DOM and inject the app
const observer = new MutationObserver((_, obs) => {
// Main layout of meetup.com; This can change based on internal styling adjustments from meetup.com
  const mainLayout = document.getElementsByClassName('flex flex-col gl:flex-row gl:gap-10')[0];

  if (mainLayout) {
    injectApp(mainLayout);
    obs.disconnect();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree  : true
});
