import { useRef } from 'react';
import { useMutation } from '@apollo/client';

const useDDMutation = (mutation, variables) => {
  const resultsObj = useRef({ called: false, loading: false, data: {}, error: {} });

  const resetResults = () => {
    resultsObj.current = {};
  };

  const [callMutation, { data, loading, error }] = useMutation(mutation, { variables }, { new: true });

  if (loading) {
    resultsObj.current.called = true;
    resultsObj.current.loading = true;
  }
  if (error) {
    resultsObj.current.error = error;
    resultsObj.current.called = true;
    resultsObj.current.loading = false;
  }
  if (data) {
    resultsObj.current.data = data;
    resultsObj.current.called = true;
    resultsObj.current.loading = false;
  }

  return [callMutation, {
    data: resultsObj.current.data,
    loading: resultsObj.current.loading,
    error: resultsObj.current.error,
    called: resultsObj.current.called,
    resetResults
  }];
};

export default useDDMutation;
