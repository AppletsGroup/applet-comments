# applet-comments
Comments Plugin for All App in AppletGroups, support both React and Vue

## Usage

```
yarn add applet-comments --save
```


### React
```
import { useEffect, useRef } from 'react'
import AppletComments from 'applet-comments';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let commentPlugin: AppletComments
    
    if (containerRef.current) {
      // postId is id of post in AppletsGroup
      commentPlugin = new AppletComments(postId, containerRef.current);
      commentPlugin.init();
    }

    return () => {
      if (commentPlugin) commentPlugin.destory();
    }
  }, []);
  
  return (
    <div ref={containerRef}></div>
  );
}

export default App
```

### Vue

```
<template>
  <div>
    <h1>Post {{ id }}</h1>
    <div ref="container"></div>
  </div>
</template>

<script>
import AppletComments from 'applet-comments';

export default {
  props: ['id'],
  mounted() {
    const appletComments = AppletComments(this.id, this.$refs.container);
    appletComments.init();

    this.$once('hook:beforeDestroy', () => {
      appletComments.destroy();
    });
  }
}
</script>

```
