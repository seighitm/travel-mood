import prisma from "../../prisma/PrismaClient";
import fs from "graceful-fs";
import * as path from 'path';
import {addNewCountry, addNewLanguage} from "../services/base.service";

export const initDatabaseScript = async () => {
  console.log(__dirname)
  console.log('__dirname')
  const countLanguages = await prisma.language.count()
  if (countLanguages <= 10) {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, '..', 'assets', 'languages.json'), 'utf8');
      const array: any = []
      Object.entries(JSON.parse(data)).forEach((entry: any) => array.push(entry[1].name));
      await addNewLanguage([...array])
    } catch (err) {
      console.error(err);
    }
  }
  const countCountries = await prisma.countries.count()
  if (countCountries <= 10) {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, '..', 'assets', 'data_json.json'), 'utf8');
      await addNewCountry(JSON.parse(data))
    } catch (err) {
      console.error(err);
    }
  }
  const countRoles = await prisma.role.count()
  if (countRoles != 2) {
    await prisma.role.createMany({
      data: [
        {role: 'ADMIN'},
        {role: 'USER'}
      ],
      skipDuplicates: true
    })
  }

  const countGender = await prisma.gender.count()
  if (countGender != 6) {
    await prisma.gender.createMany({
      data: [
        {gender: 'MALE'},
        {gender: 'FEMALE'},
        {gender: 'OTHER'},
        {gender: 'MALE_GROUP'},
        {gender: 'FEMALE_GROUP'},
        {gender: 'ANY'}
      ],
      skipDuplicates: true
    })
  }

  const relationshipStatusCount = await prisma.relationshipStatus.count()
  if (relationshipStatusCount != 2) {
    await prisma.relationshipStatus.createMany({
      data: [
        {status: 'SINGLE'},
        {status: 'IN_RELATION'},
      ],
      skipDuplicates: true
    })
  }

  const transportsCount = await prisma.transport.count()
  if (transportsCount == 0) {
    await prisma.transport.createMany({
      data: [
        {name: 'CAR'},
        {name: 'PLANE'},
      ],
      skipDuplicates: true
    })
  }
}
