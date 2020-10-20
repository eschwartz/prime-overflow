import axios from 'axios';
import { put, takeLatest, takeEvery } from 'redux-saga/effects';

function* persistQuestion(action) {
  let res;
  if (action.payload.question.id === undefined) {
    res = yield axios({
      method: 'POST',
      url: '/api/question',
      data: action.payload.question
    });
  }
  else {
    res = yield axios({
      method: 'PUT',
      url: `/api/question/${action.payload.question.id}`,
      data: action.payload.question
    });
  }

  

  yield put({
    type: 'FETCH_QUESTIONS'
  });

  action.payload.onCreate(res.data);
}

function* fetchQuestions(action) {
  const res = yield axios({
    method: 'GET',
    url: '/api/question'
  });

  yield put({
    type: 'SET_QUESTIONS',
    payload: res.data
  });
}

function* fetchQuestionToEdit(action) {
  // Grab the question by ID
  // from the server
  const res = yield axios({
    method: 'GET',
    url: `/api/question/${action.payload}`
  });

  // Send to reducer, to save as
  // store.questionToEdit
  yield put({
    type: 'SET_QUESTION_TO_EDIT',
    payload: res.data
  });
}

function* userSaga() {
  yield takeLatest('FETCH_QUESTIONS', fetchQuestions);
  yield takeLatest('FETCH_QUESTION_TO_EDIT', fetchQuestionToEdit);
  yield takeEvery('PERSIST_QUESTION', persistQuestion);
}

export default userSaga;
