export type PrimaryColorConfig = {
  name?: string
  light?: string
  main: string
  dark?: string
}

const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: 'primary-1',
    light: '#DBA07A',
    main: '#C97C4A',
    dark: '#A8612E'
  },
  {
    name: 'primary-2',
    light: '#8DAF93',
    main: '#6B8F71',
    dark: '#4D6F53'
  },
  {
    name: 'primary-3',
    light: '#DFC49A',
    main: '#C9A96E',
    dark: '#A07A3E'
  },
  {
    name: 'primary-4',
    light: '#8F85F3',
    main: '#7367F0',
    dark: '#675DD8'
  },
  {
    name: 'primary-5',
    light: '#33C8DA',
    main: '#00BAD1',
    dark: '#00A7BC'
  }
]

export default primaryColorConfig
