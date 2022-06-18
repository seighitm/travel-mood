import prisma from '../../prisma/PrismaClient'
import fs from 'graceful-fs'
import * as path from 'path'

export const initDatabaseScript = async () => {
  // const articleImages = await prisma.articleImage.findMany({select: {name: true}})
  // const userImages = await prisma.userImage.findMany({select: {image: true}})
  // const articles = await prisma.article.findMany({select: {body: true}})
  //
  // const aaa = []
  // for (let i = 0; i < articles.length; i++) {
  //   const gggg: any = articles[i].body.match(/http:\/\/localhost([^"]*)/g)?.map((item: any) => item.split('/')[item.split('/').length - 1])
  //   if (gggg) aaa.push(...gggg)
  // }
  //
  // const allImages = [...userImages.map((item: any) => item.image), ...articleImages.map((item: any) => item.name), ...aaa]
  // fs.readdirSync(path.resolve(__dirname, '..', 'uploads')).forEach(file => {
  //   if (!allImages.includes(file) && file != 'flags' && file != 'site' ){
  //     fs.unlink(path.resolve(__dirname, '..', 'uploads', file), function (err) {
  //       if (err) return console.log(err)
  //       console.log('Files deleted successfully!')
  //     })
  //   }
  // });

  const countLanguages = await prisma.language.count()
  if (countLanguages <= 10) {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, '..', 'assets', 'data-json', 'languages.json'), 'utf8')
      const array: any = []
      Object.entries(JSON.parse(data)).forEach((entry: any) => array.push(entry[1].name))
      await prisma.language.createMany({
        data: [...array].map((language: any) => ({
          name: language,
        })),
        skipDuplicates: true,
      })
    } catch (err) {
      console.error(err)
    }
  }
  const countCountries = await prisma.country.count()
  if (countCountries <= 10) {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, '..', 'assets', 'data-json', 'data_json.json'), 'utf8')
      await prisma.country.createMany({
        data: JSON.parse(data).map((country: any) => ({
          name: country.Name,
          code: country.Code,
        })),
        skipDuplicates: true,
      })
    } catch (err) {
      console.error(err)
    }
  }
  const countRoles = await prisma.role.count()
  if (countRoles != 3) {
    await prisma.role.createMany({
      data: [{role: 'ADMIN'}, {role: 'USER'}, {role: 'MODERATOR'}],
      skipDuplicates: true,
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
        {gender: 'ANY'},
      ],
      skipDuplicates: true,
    })
  }

  const relationshipStatusCount = await prisma.relationshipStatus.count()
  if (relationshipStatusCount != 2) {
    await prisma.relationshipStatus.createMany({
      data: [{status: 'SINGLE'}, {status: 'IN_RELATION'}],
      skipDuplicates: true,
    })
  }

  const transportsCount = await prisma.transport.count()
  if (transportsCount < 6) {
    await prisma.transport.createMany({
      data: [
        {name: 'CAR'},
        {name: 'PLANE'},
        {name: 'BOAT'},
        {name: 'BICYCLE'},
        {name: 'TRAIN'},
        {name: 'BUS'},
        {name: 'OTHER'},
      ],
      skipDuplicates: true,
    })
  }
}
