import websocketJoinFile from './websocketJoinFile.js';
import getUuid from 'stemn-shared/utils/getUuid.js';

export default ({projectId, fileId, revisionId, provider, timestamp}) => {
  const cacheKey = timestamp ? `${fileId}-${revisionId}-${timestamp}` : `${fileId}-${revisionId}`;
  // The cache key is used as the renderId/roomId

  return (dispatch) => {
    dispatch({
      type: 'FILES/RENDER_FILE',
      aliased: true,
      payload: {
        functionAlias: 'FileCache.get',
        functionInputs: {
          key          : cacheKey,
          renderUrl    : projectId
                         ? `/api/v1/sync/render/${projectId}/${fileId}`
                         : `/api/v1/remote/render/${provider}/${fileId}`,
          url          : projectId
                         ? `/api/v1/sync/downloadRender/${projectId}/${fileId}`
                         : `/api/v1/remote/downloadRender/${provider}/${fileId}`,
          params       : { revisionId, timestamp, roomId: cacheKey },
          name         : cacheKey,
          responseType : 'path',
          extract      : true
        }
      },
      meta: {
        cacheKey
      }
    });

    // Join the websocket room
    dispatch(websocketJoinFile({renderId: cacheKey}))
  }
}


//`http://35.167.249.144/api/v1/sync/downloadRenderFile/${projectId}/${fileId}/${revisionId}`
