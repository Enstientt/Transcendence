import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { GameState } from '../interfaces/GameState';
import { useGameContext } from './ScoreContext/GameContext';

//* Refactor idea:
//! I think using Redux Toolkit with Redux Middleware and Socket Service could be elegant here.

const useSocket = (
	initGame: Function,
	updateGame: Function,
	clearGame: Function,
	sendToServer: Function,
) => {
	// const { setTwoPlayersFound } = useGameContext();
	useEffect(() => {
		const socket = io('http://localhost:3001');

		//* Socket event listeners

		socket.on('connect', () => {
			console.log('Connected to server');
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from server');
			clearGame();
		});

		socket.on('createGame', (obj) => {
			console.log('Creating game');
			initGame(obj.gameState, obj.canvasWidth, obj.canvasHeight);
		});

		socket.on('gameState', (gameState: GameState) => {
			// console.log('Updating game');
			updateGame(gameState);
		});

		//* Socket event emitters

		// ! could be refactored to use a single function that takes in the event name and data
		sendToServer((data: any) => socket.emit('onPaddleMove', data));

		return () => {
			socket.disconnect();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useSocket;