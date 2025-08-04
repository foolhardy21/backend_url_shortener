import path from "path"
import { DataTypes, FindOptions, Model, Sequelize, WhereOptions } from "sequelize"
import { Url } from "../helpers/types"

class Database {
    #sequelize
    #Url

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
            },
            {
                tableName: "url_map",
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
            try {
                await this.#Url.sync()
                console.log("Table sync successful")
            } catch (err) {
                console.log("Error syncing the table", err)
            }
        } catch (err) {
            console.log("Error connecting to the database", err)
        }
    }

    async create({ originalUrl, shortUrl }: { originalUrl: string, shortUrl: string }): Promise<Url> {
        try {
            const instance = await this.#Url.create({ originalUrl, shortUrl })
            return instance.toJSON() as Url
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

    async delete({ where }: { where: WhereOptions }) {
        try {
            await this.#Url.destroy({
                ...(where && { where }),
            })
        } catch (err) {
            console.log(err)
            throw err as Error
        }
    }
}

const database = new Database()
database.initialize()

export default database
