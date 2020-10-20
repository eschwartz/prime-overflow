const questionsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return action.payload
    default:
      return state;
  }
}

export default questionsReducer;