const SELECTED = 'SELECTED'
const CHANGESTATE = 'CHANGESTATE'
const CHANGEMODE = 'CHANGEMODE'
const LOGINPANEL = 'LOGINPANEL'
const LOGINPANELCLOSED = 'LOGINPANELCLOSED'
const initialState = {
  status: 'unread',
  mode: false,
  show: true
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGESTATE:
      return {
        ...state,
        status: action.change
      }
    case CHANGEMODE: {
      return {
        ...state,
        mode: !state.mode
      }
    }
    case LOGINPANEL: {
      return {
        ...state,
        show: true
      }
    }
    case LOGINPANELCLOSED: {
      return {
        ...state,
        show: false
      }
    }
    default:
      return state
  }
}

export function changeState(s) {
  return {
    type: CHANGESTATE,
    change: s
  }
}

export function changeMode() {
  return {
    type: CHANGEMODE
  }
}

export function loginPanel() {
  return {
    type: LOGINPANEL
  }
}

export function closeLogin() {
  return {
    type: LOGINPANELCLOSED
  }
}
