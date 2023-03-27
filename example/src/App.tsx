import { useEffect, useRef } from 'react'
import AppletComments from '../../src/index';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let commentPlugin: AppletComments
    
    if (containerRef.current) {
      commentPlugin = new AppletComments(5888, containerRef.current);
      commentPlugin.init();
    }

    return () => {
      if (commentPlugin) commentPlugin.destory();
    }
  }, []);
  
  return (
    <div ref={containerRef} className='comments'></div>
  );
}

export default App
