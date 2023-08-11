import React from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {Button} from 'monday-ui-react-core';

type Props = {};

export function Test({}: Props) {
  const query = useQuery(['todos'], () =>{
    console.log('--> query');
    return {foo: '123'};
  });
  const mutation = useMutation({
    mutationKey: ['todos', 'set'],
    mutationFn: async (newTodo) => {
      console.log('--> mutation');
      return 'success';
    },
  });
  return (
    <>
      {JSON.stringify(query.data)}
      {JSON.stringify(query.isError)}
      {JSON.stringify(query.isLoading)}
      <Button onClick={() => mutation.mutate()}>Mutate</Button>
    </>
  );
}

