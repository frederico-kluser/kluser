import {
  isReservedWords,
  isParentComponent,
  attributesInjector
} from './../../src/helpers/attributes'
import { reservedHTMLAttributesType } from './../../src/types'

describe('test isReservedWords', () => {
  it('check is the word is reserved', () => {
    expect.assertions(3)

    // arrange
    const firstWord: reservedHTMLAttributesType = 'id'
    const secondWord: reservedHTMLAttributesType = 'kluser_props'
    const thirdWord: reservedHTMLAttributesType = 'class'

    // act
    const resultFirstWord = isReservedWords(firstWord)
    const resultSecondWord = isReservedWords(secondWord)
    const resultThirdWord = isReservedWords(thirdWord)

    // assertions
    expect(resultFirstWord).toBeTruthy()
    expect(resultSecondWord).toBeTruthy()
    expect(resultThirdWord).toBeTruthy()
  })

  it('check is the word is not reserved', () => {
    expect.assertions(3)

    // arrange
    const firstWord: string = 'style'
    const secondWord: string = 'href'
    const thirdWord: string = 'onClick'

    // act
    const resultFirstWord = isReservedWords(firstWord)
    const resultSecondWord = isReservedWords(secondWord)
    const resultThirdWord = isReservedWords(thirdWord)

    // assertions
    expect(resultFirstWord).toBeFalsy()
    expect(resultSecondWord).toBeFalsy()
    expect(resultThirdWord).toBeFalsy()
  })
})

describe('test isParentComponent', () => {
  it('check if this element is not a parent components', () => {
    expect.assertions(1)

    // arrange
    // act
    const result = isParentComponent()

    // assertions
    expect(result).toBeFalsy()
  })

  it('check if this element is a parent components', () => {
    expect.assertions(1)

    // arrange
    const sonElement = { kluser_props: '' }

    // act
    const result = isParentComponent(sonElement)

    // assertions
    expect(result).toBeTruthy()
  })
})

describe('test attributesInjector', () => {
  it('check if property will be injected', () => {
    expect.assertions(1)

    // arrange
    const obj = {
      kluser_props: '',
      src: 'www.google.com'
    }

    // act
    const result = attributesInjector(obj)

    // assertions
    expect(result).toEqual(' src="www.google.com" ')
  })

  it('check if property will not be injected', () => {
    expect.assertions(1)

    // arrange
    const obj = {
      kluser_props: true
    }

    // act
    const result = attributesInjector(obj)

    // assertions
    expect(result).toEqual('')
  })
})
