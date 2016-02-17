const SELECTED = 'SELECTED'
const CHANGE = 'CHANGE'

const initialState = {
  status: 'unread'
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE:
      return {
        ...state,
        status: action.change
      }
    default:
      return state
  }
}

export function changeState(s) {
  return {
    type: CHANGE,
    change: s
  }
}
