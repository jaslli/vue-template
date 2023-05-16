<script setup lang="ts">
import request from '/@/utils/http';
const msg: String = 'hello world';

const url: string = '/archive/test';
request
	.get<any>(
		url,
		{
			ajbh: '（2021）桂民终552号'
		},
		{
			requestOptions: {
				globalErrorMessage: true
			}
		}
	)
	.then((res) => {
		console.log('res: ', res);
	});
</script>

<template>
	<h1>{{ msg }}</h1>
</template>

<style scoped></style>
