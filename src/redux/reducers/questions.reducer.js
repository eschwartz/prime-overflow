const questionsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return action.payload
  }
  return state;
}

export const activeQuestion = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_QUESTION':
      return action.payload;
  }
  return state;
}

export default questionsReducer;