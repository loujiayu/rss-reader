const SUBSCRIBE = 'SUBSCRIBE'
const SUBSCRIBE_FAIL = 'SUBSCRIBE_FAIL'
const SUBSCRIBE_SUCCESS = 'SUBSCRIBE_SUCCESS'
const GETFEED = 'GETFEED'
const GETFEED_FAIL = 'GETFEED_FAIL'
const GETFEED_SUCCESS = 'GETFEED_SUCCESS'
const GETCONTENT = 'GETCONTENT'
const GETCONTENT_FAIL = 'GETCONTENT_FAIL'
const GETCONTENT_SUCCESS = 'GETCONTENT_SUCCESS'
const MARKREAD = 'MARKREAD'
const MARKREAD_FAIL = 'MARKREAD_FAIL'
const MARKREAD_SUCCESS = 'MARKREAD_SUCCESS'
const CONSELECTED = 'CONSELECTED'
const STAR = 'STAR'
const STAR_SUCCESS = 'STAR_SUCCESS'
const STAR_FAIL = 'STAR_FAIL'
const REFRESH = 'REFRESH'
const REFRESH_SUCCESS = 'REFRESH_SUCCESS'
const REFRESH_FAIL = 'REFRESH_FAIL'

const initialState = {
  fetch: false,
  selected: '',
  entryIndex: -1,
  refreshing: false
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SUBSCRIBE:
      return state
    case SUBSCRIBE_FAIL:
      return {
        ...state,
        error: action.error,
        subscribe: false
      }
    case SUBSCRIBE_SUCCESS:
      return {
        ...state,
        addone: action.result,
        subscribe: true
      }
    case GETFEED:
      return state
    case GETFEED_FAIL:
      return {
        ...state,
        error: action.error,
        fetch:false
      }
    case GETFEED_SUCCESS:
      return {
        ...state,
        list: action.result,
        fetch: true
      }
    case GETCONTENT:
      return state
    case GETCONTENT_FAIL:
      return {
        ...state,
        error: action.error,
        fetch: false
      }
    case GETCONTENT_SUCCESS:
      return {
        ...state,
        contents: action.result,
        selected: action.id,
        fetch: true
      }
    case MARKREAD:
      return state
    case MARKREAD_SUCCESS:
      return {
        ...state,
        list: action.result,
        fetch: true
        // entryIndex: action.entryIndex
      }
    case MARKREAD_FAIL:
      return {
        ...state,
        error: action.error,
        fetch:false
      }
    case CONSELECTED:
      return {
        ...state,
        entryIndex: action.entryIndex
      }
    case REFRESH:
      return {
        ...state,
        refreshing: true,
        refreshed: false
      }
    case REFRESH_SUCCESS:
      return {
        ...state,
        refreshing: false,
        refreshed: true
      }
    default:
      return state
  }
}

export function subscribe(rss, name) {
  return {
    types: [SUBSCRIBE, SUBSCRIBE_SUCCESS, SUBSCRIBE_FAIL],
    promise: (client) => client.post('/subscribe', {
      data: {
        name: name,
        rss: rss
      }
    })
  }
}

export function getContent(username, title, index) {
  return {
    types:[GETCONTENT, GETCONTENT_SUCCESS, GETCONTENT_FAIL],
    id: [title, index],
    promise: (client) => client.get('/feedcontent', {
      params: {
        name: username,
        title: title
      }
    })
  }
}

export function getFeeds(username) {
  return {
    types: [GETFEED, GETFEED_SUCCESS, GETFEED_FAIL],
    promise: (client) => client.get('/feedlist', {
      params: {
        name: username
      }
    })
  }
}

export function markReaded(name, id) {
  return {
    types: [MARKREAD, MARKREAD_SUCCESS, MARKREAD_FAIL],
    promise: (client) => client.post('/mark', {
      params: {
        name: name,
        index: id
      }
    })
  }
}

export function refresh(username) {
  return {
    types: [REFRESH, REFRESH_SUCCESS, REFRESH_FAIL],
    promise: (client) => client.post('/refresh', {
      params: {
        name: username
      }
    })
  }
}

export function contentSelect(index) {
  return {
    type: CONSELECTED,
    entryIndex: index
  }
}

export function star(flag, index) {
  return {
    types: [STAR,STAR_SUCCESS, STAR_FAIL],
    promise: (client) => client.post('/star', {
      params: {
        index: index,
        star: !flag
      }
    })
  }
}
