import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import * as paypal from 'paypal-rest-sdk';
import { CreateOrderDto } from '../users/dto/create-order.dto';
import { TransactionService } from '../transactions/transaction.service';
import { User } from '../users/entities/user.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PaypalService {
	constructor(
		private readonly transactionService: TransactionService,
		private readonly loggerService: LoggerService
	) {
		paypal.configure({
			mode: 'sandbox', // @todo: make this production when NODE_ENV
			client_id: process.env.PAYPAL_CLIENT,
			client_secret: process.env.PAYPAL_SECRET,
		});

		this.loggerService.setContext('paypal.service');
	}

	async createOrder(
		user: User,
		createOrderDto: CreateOrderDto
	): Promise<string> {
		const bundlePrice = parseFloat(process.env.BUNDLE_PRICE);
		const amount = createOrderDto.amount || 1;
		const bundleAmount = 10;
		const discount = -amount * (amount - 1) * 0.5 * 0.1 * bundlePrice;
		const price = bundlePrice;
		const totalSum = amount * price + discount;

		const items = [
			{
				name: 'Feedback Tool sessions bundle',
				price: price.toLocaleString('pl-PL', {
					maximumFractionDigits: 2,
					minimumFractionDigits: 2,
				}),
				currency: 'PLN',
				quantity: amount,
			},
		];

		if (amount > 1) {
			items.push({
				name: 'Discount',
				price: discount.toLocaleString('pl-PL', {
					maximumFractionDigits: 2,
					minimumFractionDigits: 2,
				}),
				currency: 'PLN',
				quantity: 1,
			});
		}

		this.loggerService.info('Create order', { amount, totalSum, discount, bundlePrice });

		const transaction = await this.transactionService.create({
			amount: amount * bundleAmount,
			price: totalSum.toLocaleString('pl-PL', {
				maximumFractionDigits: 2,
				minimumFractionDigits: 2,
			}),
			userId: user.id,
		});

		const paymentConfig: paypal.Payment = {
			intent: 'sale',
			payer: {
				payment_method: 'paypal',
			},
			redirect_urls: {
				return_url: `${process.env.CLIENT_URL}/order?id=${encodeURIComponent(
					transaction.id
				)}`,
				cancel_url: `${process.env.CLIENT_URL}/order?id=${encodeURIComponent(
					transaction.id
				)}&cancel=true`,
			},
			transactions: [
				{
					item_list: {
						items,
					},
					amount: {
						currency: 'PLN',
						total: totalSum.toLocaleString('pl-PL', {
							maximumFractionDigits: 2,
							minimumFractionDigits: 2,
						}),
					},
					description: `It's a bundle consiting of ${
						bundleAmount * amount
						} premium sessions for FeedbackTool.`,
				},
			],
		};

		const response: paypal.PaymentResponse = await new Promise(
			(resolve, reject) => {
				paypal.payment.create(
					paymentConfig,
					(error: paypal.SDKError, payment: paypal.PaymentResponse) =>
						error ? reject(error) : resolve(payment)
				);
			}
		);

		const approvalLink = response.links.find(
			(link) => link.rel === 'approval_url'
		);
		if (!approvalLink) {
			throw new UnprocessableEntityException(
				"There's no approval link available"
			);
		}

		return approvalLink.href;
	}
}
