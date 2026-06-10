import path from "path"
import { DataTypes, FindOptions, Model, Sequelize, UpdateOptions, WhereOptions } from "sequelize"
import { Log, Url, User } from "../helpers/types"
import { USER_TYPES } from "../helpers/utils"

class Database {
    #sequelize
    #Url
    #User
    #Log

    constructor() {
        this.#sequelize = new Sequelize({
            dialect: "sqlite",
            storage: path.resolve(__dirname, "../../url_shortener_db.sqlite"),
        })
        this.#Url = this.#sequelize.define(
            "Url",
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                originalUrl: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                shortUrl: {
                    type: DataTypes.TEXT,
                    unique: true,
                },
                visitCount: {
                    type: DataTypes.INTEGER,
                    defaultValue: 0,
                },
                accessedAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: "users",
                        key: "id",
                    }
                },
                deletedAt: {
                    type: DataTypes.DATE,
                },
                expiryDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                password: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    unique: true,
                }
            },
            {
                tableName: "url_map",
                underscored: true,
                timestamps: true,
                updatedAt: false,
            }
        )
        this.#User = this.#sequelize.define(
            "User",
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                email: {
                    type: DataTypes.TEXT,
                    unique: true,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.TEXT,
                },
                apiKey: {
                    type: DataTypes.UUIDV4,
                    unique: true,
                    allowNull: false,
                },
                tier: {
                    type: DataTypes.ENUM(USER_TYPES.HOBBY, USER_TYPES.ENTERPRISE),
                    defaultValue: USER_TYPES.HOBBY,
                    allowNull: false,
                }
            },
            {
                tableName: "users",
                underscored: true,
                timestamps: true,
                updatedAt: false,
            }
        )
        this.#Log = this.#sequelize.define(
            "Log",
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                method: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                url: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                timestamp: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                userAgent: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                ipAddress: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                tableName: "logs",
                underscored: true,
                timestamps: false,
            })
    }

    async initialize() {
        try {
            await this.#sequelize.authenticate()
            console.log("Connected to the database")
        } catch (err) {
            console.log("Error connecting to the database", err)
        }
    }

    async close() {
        await this.#sequelize.close()
    }

    async create({ originalUrl, shortUrl, userId, expiryDate, password }: { originalUrl: string, shortUrl: string, userId: number, expiryDate?: Date, password?: string }): Promise<Url> {
        try {
            const instance = await this.#Url.create({
                originalUrl,
                shortUrl,
                userId,
                ...(expiryDate && { expiryDate }),
                ...(password && { password }),
            })
            return instance.toJSON() as Url
        } catch (err) {
            console.log(err)
            throw err as Error
        }
    }

    async update(columns: Record<string, unknown>, options: { where: WhereOptions } & Partial<UpdateOptions>): Promise<number[]> {
        try {
            const res = await this.#Url.update(columns, options)
            return res
        } catch (err) {
            console.log(err)
            throw err as Error
        }
    }

    async get({ where, options }: { where: WhereOptions, options: FindOptions }): Promise<Url[]> {
        try {
            const urlModels: Model[] = await this.#Url.findAll({
                ...(where && { where }),
                ...(options && options),
            })
            const urls = urlModels.map((url: Model) => url.toJSON() as Url)
            return urls
        } catch (err) {
            console.log(err)
            throw err as Error
        }
    }

    async delete({ where }: { where: WhereOptions }): Promise<number> {
        try {
            const deletedCount = await this.#Url.destroy({
                ...(where && { where }),
            })
            return deletedCount
        } catch (err) {
            console.log(err)
            throw err as Error
        }
    }

    async getUsers({ where, options }: { where: WhereOptions, options: FindOptions }): Promise<User[]> {
        try {
            const userModels = await this.#User.findAll({
                ...(where && { where }),
                ...(options && options),
            })
            return userModels.map(userModel => userModel.toJSON() as User)
        } catch (err) {
            console.log(err)
            throw err as Error
        }
    }

    async createLog({ method, url, timestamp, userAgent, ipAddress }: { method: string, url: string, timestamp: Date, userAgent?: string, ipAddress?: string }): Promise<Log> {
        try {
            const instance = await this.#Log.create({
                method,
                url,
                timestamp,
                ...(userAgent && { userAgent }),
                ...(ipAddress && { ipAddress }),
            })
            return instance.toJSON() as Log
        } catch (err) {
            console.log(err)
            throw err as Error
        }
    }
}

const database = new Database()
database.initialize()

export default database
