import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';

class Feedback extends Model {}

Feedback.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  trackingId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('complaint', 'compliment', 'suggestion'),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('received', 'acknowledged', 'under_investigation', 'resolved', 'closed'),
    defaultValue: 'received'
  },
  department: {
    type: DataTypes.ENUM('health', 'education', 'transport', 'water', 'finance', 'other'),
    allowNull: true
  },
  statusHistory: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  sequelize,
  modelName: 'Feedback',
  timestamps: true,
  underscored: true
});

export default Feedback;