import {
	registerFont,
	createCanvas,
	loadImage,
	CanvasRenderingContext2D,
} from 'canvas';
import { Room } from '../rooms/entities/room.entity';
import { table, getBorderCharacters } from 'table';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

// @ts-expect-error
CanvasRenderingContext2D.prototype.roundRect = function (
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number
) {
	radius = Math.min(Math.max(width - 1, 1), Math.max(height - 1, 1), radius);
	const rectX = x;
	const rectY = y;
	const rectWidth = width;
	const rectHeight = height;
	const cornerRadius = radius;

	this.lineJoin = 'round';
	this.lineWidth = cornerRadius;
	this.strokeRect(
		rectX + cornerRadius / 2,
		rectY + cornerRadius / 2,
		rectWidth - cornerRadius,
		rectHeight - cornerRadius
	);
	this.fillRect(
		rectX + cornerRadius / 2,
		rectY + cornerRadius / 2,
		rectWidth - cornerRadius,
		rectHeight - cornerRadius
	);
	this.stroke();
	this.fill();
};

@Injectable()
export class ExportService {
	private getLineCount(
		ctx: CanvasRenderingContext2D,
		content: string,
		maxWidth: number,
		newLineCallback?: (line: string) => void
	): number {
		return content.split('\n').map((line) => line.split(' ')).reduce((count, words) => {
			let currentLine = '';
			words.forEach((word, index) => {
				currentLine += word + ' ';

				if (ctx.measureText(currentLine).width > maxWidth) {
					let tempCurrentLine = '';
					let letterIndex = 1;
					do {
						tempCurrentLine = currentLine.substring(0, currentLine.length - letterIndex++);
					} while (ctx.measureText(tempCurrentLine).width > maxWidth);
					count++;
					newLineCallback && newLineCallback(tempCurrentLine);
					currentLine = currentLine.substring(tempCurrentLine.length);
				}

				if (index === words.length - 1) {
					newLineCallback && newLineCallback(currentLine);
				}
			});

			return count + 1;
		}, 0);
	}

	async exportAsImage(room: Room): Promise<string> {
		const lists = room.lists;

		const COLUMN_WIDTH = 300;
		const LISTS_PADDING = 50;
		const NOTES_PADDING = 10;
		const NOTES_MARGIN = 10;
		const NOTES_WIDTH = COLUMN_WIDTH - 2 * NOTES_MARGIN;
		const LINE_HEIGHT = 20;
		const LINE_CHARACTERS = 25;

		registerFont('./files/Montserrat-Regular.ttf', { family: 'Montserrat' });

		const tempContext = createCanvas(COLUMN_WIDTH, 1000).getContext('2d');
		tempContext.font = '16px Montserrat';

		const width = lists.length * COLUMN_WIDTH + 2 * LISTS_PADDING;
		const height =
			lists.reduce((finalHeight, list) => {
				const textHeight = list.notes.reduce((height, note) => {
					const linesCount = this.getLineCount(
						tempContext,
						note.content,
						NOTES_WIDTH - NOTES_PADDING * 2
					);
					return (
						linesCount * LINE_HEIGHT + NOTES_PADDING * 2 + NOTES_MARGIN + height
					);
				}, 0);

				return Math.max(textHeight, finalHeight);
			}, 0) +
			100 +
			40;

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = '#EFEFEF';
		ctx.fillRect(0, 0, width, height);

		const leaf = await loadImage('./files/leaf.png');
		const leafs: Array<{ x: number; y: number; }> = [];
		for (let i = Math.floor(Math.random() * 3) + 5; i >= 0; i--) {
			let x: number, y: number;
			do {
				x = Math.random() * width;
				y = Math.random() * height;
			} while (
				leafs.find(
					(l) =>
						(l.x - x) ** 2 + (l.y - y) ** 2 <
						Math.max(leaf.width, leaf.height) ** 2 * 1.5
				)
			);
			const scale = Math.min(Math.random() + 0.4, 1);
			const rotation = Math.random() * Math.PI * 2;
			const w = leaf.width * scale;
			const h = leaf.height * scale;
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(rotation);
			ctx.drawImage(leaf, -w * 0.5, -h * 0.5, w, h);
			ctx.restore();

			leafs.push({ x, y });
		}

		lists.forEach((list, index) => {
			ctx.font = '20px Montserrat';
			ctx.fillStyle = '#515151';
			ctx.fillText(
				list.name,
				index * COLUMN_WIDTH +
				(COLUMN_WIDTH - ctx.measureText(list.name).width) * 0.5 +
				LISTS_PADDING,
				50
			);

			let y = 90;
			ctx.font = '16px Montserrat';
			list.notes.forEach((note) => {
				const linesCount = this.getLineCount(
					ctx,
					note.content,
					NOTES_WIDTH - NOTES_PADDING * 2
				);
				const x = index * COLUMN_WIDTH + LISTS_PADDING + NOTES_MARGIN;

				ctx.fillStyle = '#ffffff';
				ctx.strokeStyle = '#ffffff';
				// @ts-expect-error
				ctx.roundRect(
					x,
					y,
					NOTES_WIDTH,
					linesCount * LINE_HEIGHT + NOTES_PADDING * 2,
					5
				);

				ctx.fillStyle = note.positive ? '#81B800' : '#FF5453';
				ctx.strokeStyle = note.positive ? '#81B800' : '#FF5453';
				// @ts-expect-error
				ctx.roundRect(x, y, 2, linesCount * LINE_HEIGHT + NOTES_PADDING * 2, 5);

				ctx.fillStyle = '#515151';

				this.getLineCount(
					ctx,
					note.content,
					NOTES_WIDTH - NOTES_PADDING * 2,
					(line) => {
						ctx.fillText(
							line,
							x + NOTES_PADDING,
							y + LINE_HEIGHT * 0.75 + NOTES_PADDING
						);
						y += LINE_HEIGHT;
					}
				);

				y += NOTES_PADDING * 2 + NOTES_MARGIN;
			});

			if (list.notes.length === 0) {
				const text = 'This list is empty.';
				ctx.fillText(
					text,
					index * COLUMN_WIDTH +
					(COLUMN_WIDTH - ctx.measureText(text).width) * 0.5 +
					LISTS_PADDING,
					80
				);
			}
		});

		const date = new Date();
		const signature = `FeedbackTool | ${date.toDateString()} ${date.toLocaleTimeString(
			'PL'
		)}`;
		ctx.fillStyle = '#515151';
		ctx.font = '10px Montserrat';
		ctx.fillText(
			signature,
			width - ctx.measureText(signature).width - 20,
			height - 20
		);

		ctx.fillText(`${room.name}'s feedback`, 20, height - 20);

		const filename = `./files/tempExportNotes_${Date.now()}.png`;
		const out = fs.createWriteStream(filename);
		const stream = canvas.createPNGStream();
		stream.pipe(out);
		await new Promise((resolve, reject) => {
			out.on('finish', resolve);
			out.on('error', reject);
		});

		return filename;
	}

	async exportAsText(room: Room): Promise<string> {
		const notes = room.lists.reduce(
			(notes, list) => {
				const result = list.notes.reduce(
					(acc, note) => {
						if (note.positive) {
							acc.good.push(note.content);
						} else {
							acc.bad.push(note.content);
						}
						return acc;
					},
					{ good: [], bad: [] }
				);
				notes.good.push(...result.good);
				notes.bad.push(...result.bad);
				return notes;
			},
			{ good: [], bad: [] }
		);
		const maxLength = Math.max(notes.good.length, notes.bad.length);
		const data = [['           Positive', '           Negative']];
		for (let i = 0; i < maxLength; i++) {
			const good = notes.good[i].includes(',') ? `"${notes.good[i]}"` : notes.good[i];
			const bad = notes.bad[i].includes(',') ? `"${notes.bad[i]}"` : notes.bad[i];
			data.push([good, bad]);
		}
		const result = table(data, {
			border: getBorderCharacters('ramac'),
			columnDefault: {
				width: 30,
			},
		});

		const filename = `./files/tempExportNotes_${Date.now()}.txt`;
		await fs.promises.writeFile(filename, result);

		return filename;
	}

	async exportAsCsv(room: Room): Promise<string> {
		let result = 'Positive,Negative\n';
		const notes = room.lists.reduce(
			(notes, list) => {
				const result = list.notes.reduce(
					(acc, note) => {
						if (note.positive) {
							acc.good.push(note.content);
						} else {
							acc.bad.push(note.content);
						}
						return acc;
					},
					{ good: [], bad: [] }
				);
				notes.good.push(...result.good);
				notes.bad.push(...result.bad);
				return notes;
			},
			{ good: [], bad: [] }
		);
		const count = Math.max(notes.good.length, notes.bad.length);
		for (let i = 0; i < count; i++) {
			const good = notes.good[i] ? (notes.good[i].includes(',') || notes.good[i].includes('\n') ? `"${notes.good[i]}"` : notes.good[i]) : '';
			const bad = notes.bad[i] ? (notes.bad[i].includes(',') || notes.bad[i].includes('\n') ? `"${notes.bad[i]}"` : notes.bad[i]) : '';
			result += `${good.replace(/\n/g, '\r')},${bad.replace(/\n/g, '\r')}\r\n`;
		}

		const filename = `./files/tempExportNotes_${Date.now()}.txt`;
		await fs.promises.writeFile(filename, result);

		return filename;
	}

	async removeFile(filename: string) {
		await fs.promises.unlink(filename);
	}
}
