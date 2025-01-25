'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('bookings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    room_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'hotel_rooms',
        key: 'id'
      },
    },
    hotel_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'hotels',
        key: 'id'
      },
    },
    reservation_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    checkin_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    checkout_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    total_guests: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    total_value: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    status_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'booking_statuses',
        key: 'id'
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('bookings');
}