import { DataTypes } from 'sequelize';
import { Database } from '../../database';

const UserMaster = Database.getConnection().define(
	'UserMaster',
	{
		id: {
			type: DataTypes.BIGINT,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},

		name: {
			type: DataTypes.TEXT,
			allowNull: true,
		},

		sex: {
			type: DataTypes.ENUM,
			values: ['m', 'f', 'o'],
			allowNull: true,
		},

		dob: {
			type: DataTypes.DATE,
			allowNull: true,
		},

		mobile_no: {
			type: DataTypes.TEXT,
			allowNull: true,
			unique: true,
		},

		email: {
			type: DataTypes.TEXT,
			allowNull: true,
			unique: true,
			validate: {
				isEmail: true,
			},
		},

		password: {
			type: DataTypes.TEXT,
			allowNull: true,
		},

		status: {
			type: DataTypes.ENUM,
			values: ['active', 'inactive'],
			allowNull: false,
		},
	},
	{
		timestamps: true,
		tableName: 'user_masters',
	},
);

export default UserMaster;
