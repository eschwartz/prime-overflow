import axios from 'axios';
import { put, takeLatest, takeEvery } from 'redux-saga/effects';

function* persistQuestion(action) {
  let res;
  let question = action.payload.question;

  if (question.id !== undefined) {
    res = yield axios({
      method: 'PUT',
      url: `/api/question/${question.id}`,
      data: question
    })
  }
  else {
    res = yield axios({
      method: 'POST',
      url: `/api/question`,
      data: question
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
  // Grab question from API, by ID
  const res = yield axios({
    method: 'GET',
    url: `/api/question/${action.payload}`
  });

  yield put({
    type: 'SET_QUESTION_TO_EDIT',
    payload: res.data
  });
}

function* userSaga() {
  yield takeLatest('FETCH_QUESTIONS', fetchQuestions);
  yield takeEvery('PERSIST_QUESTION', persistQuestion);
  yield takeEvery('FETCH_QUESTION_TO_EDIT', fetchQuestionToEdit);
}

export default userSaga;
