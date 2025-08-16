import path from "path"
import { DataTypes, FindOptions, Model, Sequelize, UpdateOptions, WhereOptions } from "sequelize"
import { Url, User } from "../helpers/types"

class Database {
    #sequelize
    #Url
    #User

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
            },
            {
                tableName: "users",
                underscored: true,
                timestamps: true,
                updatedAt: false,
            }
        )
    }

    async initialize() {
        try {
            await this.#sequelize.authenticate()
            console.log("Connected to the database")
        } catch (err) {
            console.log("Error connecting to the database", err)
        }
    }

    async create({ originalUrl, shortUrl, userId }: { originalUrl: string, shortUrl: string, userId: number }): Promise<Url> {
        try {
            const instance = await this.#Url.create({ originalUrl, shortUrl, userId })
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
}

const database = new Database()
database.initialize()

export default database
