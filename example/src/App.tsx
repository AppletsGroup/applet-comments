import { useEffect, useRef, useState } from 'react'
import CommentPlugin from '../../src/index';

function App() {
  const containerRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current && !initialized) {
        console.log(111)
        const commentPlugin = new CommentPlugin(5888, containerRef.current);
        commentPlugin.init();
        setInitialized(true);
      }
    }, 500);
  }, [initialized]);
  
  return (
    <div ref={containerRef} className='comments'></div>
  );

}

export default App
