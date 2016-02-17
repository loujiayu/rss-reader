const SEARCH_FAIL = 'SEARCH_FAIL'
const SEARCH_SUCCESS = 'SEARCH_SUCCESS'
const SEARCH = 'SEARCH'
const CLOSE = 'CLOSE'
const STREAM = 'STREAM'
const STREAM_FAIL = 'STREAM_FAIL'
const STREAM_SUCCESS = 'STREAM_SUCCESS'

const initialState = {
  loaded: false,
  loading: false
}

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
    case SEARCH_FAIL:
      return {
        ...state,
        search: false,
        loading: false
      }
    case SEARCH_SUCCESS:
      return {
        ...state,
        loaded: true,
        data: action.result
      }
    case SEARCH:
      return {
        ...state,
        loading: true
      }
    case CLOSE:
      return {
        ...state,
        loading: false
      }
    case STREAM:
      return {
        ...state,
        contentLoading: true
      }
    case STREAM_FAIL:
      return {
        ...state,
        contentLoading: false,
        contentLoaded: false
      }
    case STREAM_SUCCESS:
      return {
        ...state,
        contentLoaded: true,
        contentLoading: false,
        contents: action.result
      }
    default:
      return state
  }
}

export function isLoaded(globalState) {
  return globalState.info && globalState.feedly.loaded
}

export function closePanel() {
  return {
    type: CLOSE
  }
}

export function search(query) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    promise: (client) =>
      client.get('/search', {
        params: {
          query: query,
          count:10
        }
      })
  }
}

export function stream(username, feedId) {
  return {
    types: [STREAM, STREAM_SUCCESS, STREAM_FAIL],
    promise: (client) =>
      client.post('/stream', {
        params: {
          streamId: feedId,
          n:10,
          continuation:''
        }
      })
  }
}
