export enum PlantType {
  RICE = 'ข้าว',
  SUGAR_CANE = 'อ้อย',
  CORN = 'ข้าวโพด',
  CASSAVA = 'มันสำปะหลัง',
  OIL_PALM = 'ปาล์มน้ำมัน',
  RUBBER = 'ยางพารา',
  FRUIT_VEGETABLES = 'พืชรับประทานผล', //แตงกวา ฟักทอง บวบ
  ROOT_VEGETABLES = 'พืชรับประทานหัว',
  LEAF_VEGETABLES = 'พืชรับประทานใบ ต้น และดอก',
  FRUIT_TREES = 'ไม้ผล',
  ORCHIDS = 'กล้วยไม้',
  FLOWERING_PLANTS = 'ไม้ดอก'
}

export enum CanopySize {
  SMALL = 1, // 20 liters/ไร่
  MEDIUM = 1.5, // 30 liters/ไร่
  LARGE = 2 // 40 liters/ไร่
}

export enum FertilizerType {
  APSA_80 = 'แอ็ปซ่า-80',
  NITROGEN_PLUS = 'ไนโตรเจน พลัส (30-0-0)',
  NPK_PLUS = 'เอ็น พี เค พลัส (4-18-18)',
  POTASSIUM_PLUS = 'โพแทสเซียม พลัส (0-0-28)',
  AG = 'เอจี',
  CALCIUM_BORON = 'แคลเซียม-โบรอน',
  ZINC_PLUS = 'ซิงค์ พลัส',
  SOIL_PLUS = 'นิวทริแพลนท์ ซอยล์ พลัส'
}

export const FertilizerPrices: Record<FertilizerType, number> = {
  [FertilizerType.APSA_80]: 527,
  [FertilizerType.NITROGEN_PLUS]: 1095,
  [FertilizerType.NPK_PLUS]: 1218,
  [FertilizerType.POTASSIUM_PLUS]: 1095,
  [FertilizerType.AG]: 1291,
  [FertilizerType.CALCIUM_BORON]: 1136,
  [FertilizerType.ZINC_PLUS]: 1136,
  [FertilizerType.SOIL_PLUS]: 1291
}

export const FertilizerVolume: Record<FertilizerType, number> = {
  [FertilizerType.APSA_80]: 1000,
  [FertilizerType.NITROGEN_PLUS]: 1000,
  [FertilizerType.NPK_PLUS]: 1000,
  [FertilizerType.POTASSIUM_PLUS]: 1000,
  [FertilizerType.AG]: 1000,
  [FertilizerType.CALCIUM_BORON]: 1000,
  [FertilizerType.ZINC_PLUS]: 1000,
  [FertilizerType.SOIL_PLUS]: 1000
}

export const FertilizerImage: Record<FertilizerType, string> = {
  [FertilizerType.APSA_80]: '/product/apsa.jpg',
  [FertilizerType.NITROGEN_PLUS]: '/product/n.jpg',
  [FertilizerType.NPK_PLUS]: '/product//npk.jpg',
  [FertilizerType.POTASSIUM_PLUS]: '/product/k.jpg',
  [FertilizerType.AG]: '/product/ag.jpg',
  [FertilizerType.CALCIUM_BORON]: '/product/cab.jpg',
  [FertilizerType.ZINC_PLUS]: '/product/zn.jpg',
  [FertilizerType.SOIL_PLUS]: '/product/soil.jpg'
}

export enum FertilizerFormula {
  FORMULA_0_0_28 = '0-0-28',
  FORMULA_4_18_18 = '4-18-18',
  FORMULA_17_9_9 = '17-9-9',
  FORMULA_9_14_14 = '9-14-14',
  FORMULA_14_7_24 = '14-7-24',
  FORMULA_3_8_3_6_3_6 = '3.8-3.6-3.6',
  FORMULA_17_11_11 = '17-11-11',
  FORMULA_14_7_17 = '14-7-17',
  FORMULA_14_7_21 = '14-7-21',
  FORMULA_12_14_14 = '12-14-14',
  FORMULA_15_14_14 = '15-14-14',
  FORMULA_15_7_18 = '15-7-18',
  FORMULA_16_14_14 = '16-14-14',
  FORMULA_13_13_21 = '13-13-21',
  FORMULA_30_5_18 = '30-5-18',
  FORMULA_20_7_7 = '20-7-7',
  FORMULA_20_20_20 = '20-20-20',
  FORMULA_20_10_12 = '20-10-12',
  FORMULA_20_10_20 = '20-10-20'
}
export const PlantStagesGrouped: Record<
  PlantType,
  {
    leafStages: Record<
      string,
      {
        description: string
        fertilizers: Array<{
          formula?: FertilizerFormula
          type: Partial<Record<FertilizerType, number>>
        }>
      }
    >
    soilStages: Record<
      string,
      {
        description: string
        fertilizers: Array<{
          formula?: FertilizerFormula
          type: Partial<Record<FertilizerType, number>>
        }>
      }
    >
  }
> = {
  [PlantType.RICE]: {
    leafStages: {
      STAGE_20_DAYS: {
        description: 'อายุ 20 วัน (นาปรัง) / อายุ 35-40 วัน (นาปี)',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_20_7_7,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 60,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.AG]: 40,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      STAGE_35_40_DAYS: {
        description: 'อายุ 35-40 วัน (นาปรัง) / อายุ 60-70 วัน (นาปี)',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_17_9_9,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 50,
              [FertilizerType.NPK_PLUS]: 50,
              [FertilizerType.AG]: 40,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      FLAG_LEAVES: {
        description: 'ช่วงข้าวอุ้มท้องมีใบธง',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_9_14_14,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 20,
              [FertilizerType.NPK_PLUS]: 80,
              [FertilizerType.AG]: 30,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      GRAINS: {
        description:
          'ข้าวติดเม็ด (10 วันหลังข้าวติดเมล็ด หรือเกสรร่วง) ฉีดซ้ำทุก 10 วัน',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_14_7_24,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.POTASSIUM_PLUS]: 60,
              [FertilizerType.AG]: 30,
              [FertilizerType.CALCIUM_BORON]: 40,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      SOIL_PREP: {
        description: 'เตรียมดินก่อนปลูกข้าว',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 10,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      },
      PLANTED: {
        description: 'กรณีปลูกข้าวแล้ว',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      }
    }
  },
  [PlantType.SUGAR_CANE]: {
    leafStages: {
      SEED_TREATMENT: {
        description: 'แช่หรือฉีดพ่นท่อนพันธุ์ก่อนการปลูก',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_3_8_3_6_3_6,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 10,
              [FertilizerType.NPK_PLUS]: 20,
              [FertilizerType.AG]: 20,
              [FertilizerType.CALCIUM_BORON]: 10,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      MONTHS_1_2: {
        description: 'อายุ 1-2 เดือน (ไม่แล้ง)',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_17_11_11,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 50,
              [FertilizerType.NPK_PLUS]: 60,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      MONTHS_1_2_DRY: {
        description: 'อายุ 1-2 เดือน (แล้ง)',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 50,
              [FertilizerType.NPK_PLUS]: 60,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      MONTHS_3_4: {
        description: 'อายุ 3-4 เดือน',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_14_7_17,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.POTASSIUM_PLUS]: 35,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 50,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      MONTHS_5_6: {
        description: 'อายุ 5-6 เดือน',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_14_7_21,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.POTASSIUM_PLUS]: 50,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 50,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      SOIL_PREP: {
        description: 'เตรียมดินก่อนปลูกอ้อย',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      },
      PLANTED: {
        description: 'กรณีปลูกอ้อยแล้ว',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      }
    }
  },
  [PlantType.CORN]: {
    leafStages: {
      SEEDLING: {
        description: 'ช่วงเจริญเติบโต (ผลิใบ 3-4 ใบ หรืออายุ 15 วัน)',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_20_7_7,
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.NITROGEN_PLUS]: 60,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      EARLY_FLOOD: {
        description: 'อุ่มท้อง (ก่อนเกสรตัวผู้บาน หรืออายุ 35-45 วัน)',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_12_14_14,
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.NITROGEN_PLUS]: 30,
              [FertilizerType.NPK_PLUS]: 80,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      EARLY_MAIZE: {
        description: 'ข้าวโพดติดฝักอ่อน (อายุ 50 วัน)',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_14_7_24,
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.POTASSIUM_PLUS]: 60,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      SOIL_PREP: {
        description: 'เตรียมดินก่อนปลูกข้าวโพด',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      },
      PLANTED: {
        description: 'กรณีปลูกข้าวโพดแล้ว',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      }
    }
  },
  [PlantType.CASSAVA]: {
    leafStages: {
      SEED_TREATMENT: {
        description: 'การแช่มันสำปะหลังก่อนการปลูก (จุ่มหรือแช่ไม่นาน 5 นาที)',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_3_8_3_6_3_6,
            type: {
              [FertilizerType.APSA_80]: 5,
              [FertilizerType.NITROGEN_PLUS]: 10,
              [FertilizerType.NPK_PLUS]: 20,
              [FertilizerType.AG]: 20,
              [FertilizerType.CALCIUM_BORON]: 20,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      MONTHS_1_2: {
        description: 'อายุ 1-2 เดือน (เร่งต้น)',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_17_11_11,
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.NITROGEN_PLUS]: 50,
              [FertilizerType.NPK_PLUS]: 60,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      MONTHS_3_4: {
        description: 'อายุ 3-4 เดือน (เร่งต้น/เร่งให้ลงหัว)',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_15_7_18,
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.NITROGEN_PLUS]: 45,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.POTASSIUM_PLUS]: 40,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      MONTHS_5_6: {
        description: 'อายุ 5-6 เดือน (เร่งให้ลงหัว)',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_14_7_24,
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.POTASSIUM_PLUS]: 60,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      SOIL_PREP: {
        description: 'เตรียมดินก่อนปลูกมันสำปะหลัง',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 5,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      },
      PLANTED: {
        description: 'กรณีปลูกมันสำปะหลังแล้ว',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      }
    }
  },
  [PlantType.OIL_PALM]: {
    leafStages: {
      TREE_MAINTENANCE: {
        description: 'บำรุงต้นและใบ ให้ฉีดพ่นเดือนละ 1 ครั้ง',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_15_14_14,
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 80,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      PRODUCTION_BOOST: {
        description: 'เร่งผลผลิต ให้ฉีดพ่นทุก 15 วัน',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_13_13_21,
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.NITROGEN_PLUS]: 35,
              [FertilizerType.NPK_PLUS]: 70,
              [FertilizerType.POTASSIUM_PLUS]: 30,
              [FertilizerType.AG]: 40,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      ALL_STATE: {
        description: 'ทุกช่วง',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 20,
              [FertilizerType.SOIL_PLUS]: 200
            }
          }
        ]
      }
    }
  },
  [PlantType.RUBBER]: {
    leafStages: {
      YOUNG: {
        description: 'ยางพารายังไม่เปิดกรีด ฉีดพ่นทางใบเดือนละ 1 ครั้ง',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_20_10_12,
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.AG]: 40,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          },
          {
            formula: FertilizerFormula.FORMULA_20_20_20,
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.AG]: 40,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      TAPPED: {
        description: 'ยางพาราเปิดกรีดแล้ว ฉีดพ่นทุก 20 วัน',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_30_5_18,
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.NITROGEN_PLUS]: 30,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.POTASSIUM_PLUS]: 40,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      SOIL_PREP: {
        description: 'การเตรียมดินก่อนปลูกยางพารา',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      },
      PLANTED: {
        description: 'กรณีปลูกยางพาราแล้ว',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      }
    }
  },
  [PlantType.FRUIT_VEGETABLES]: {
    leafStages: {
      GROWTH: {
        description: 'ช่วงเจริญเติบโต',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_20_7_7,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.AG]: 40,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      FLOWERING_PREP: {
        description: 'ช่วงเริ่มติดดอก',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_12_14_14,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 30,
              [FertilizerType.NPK_PLUS]: 80,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      FLOWERING_FRUITING: {
        description: 'ช่วงติดดอกและติดผล',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_15_14_14,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 35,
              [FertilizerType.NPK_PLUS]: 70,
              [FertilizerType.POTASSIUM_PLUS]: 30,
              [FertilizerType.AG]: 40,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          },
          {
            formula: FertilizerFormula.FORMULA_13_13_21,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 35,
              [FertilizerType.NPK_PLUS]: 70,
              [FertilizerType.POTASSIUM_PLUS]: 30,
              [FertilizerType.AG]: 40,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      SOIL_PREP: {
        description: 'การเตรียมดินก่อนปลูกพืชผัก',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 20,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      },
      PLANTED: {
        description: 'กรณีปลูกพืชผักแล้ว',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      }
    }
  },
  [PlantType.ROOT_VEGETABLES]: {
    leafStages: {
      GROWTH: {
        description: 'ช่วงเร่งต้น',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_17_11_11,
            type: {
              [FertilizerType.NITROGEN_PLUS]: 50,
              [FertilizerType.NPK_PLUS]: 60,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      GROWTH_TUBER: {
        description: 'ช่วงเร่งต้น เร่งให้ลงหัว',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_15_7_18,
            type: {
              [FertilizerType.NITROGEN_PLUS]: 45,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.POTASSIUM_PLUS]: 40,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      TUBER_DEVELOPMENT: {
        description: 'ช่วงเร่งให้ลงหัว',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_14_7_24,
            type: {
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.POTASSIUM_PLUS]: 60,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      SOIL_PREP: {
        description: 'การเตรียมดินก่อนปลูกพืชผัก',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 20,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      },
      PLANTED: {
        description: 'กรณีปลูกพืชผักแล้ว',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      }
    }
  },
  [PlantType.LEAF_VEGETABLES]: {
    leafStages: {
      GROWTH: {
        description: 'เริ่มปลูกหรือบำรุงต้น',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_20_7_7,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 60,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.AG]: 40,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          },
          {
            formula: FertilizerFormula.FORMULA_15_14_14,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 80,
              [FertilizerType.AG]: 30,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      SOIL_PREP: {
        description: 'การเตรียมดินก่อนปลูกพืชผัก',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 20,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      },
      PLANTED: {
        description: 'กรณีปลูกพืชผักแล้ว',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      }
    }
  },
  [PlantType.FRUIT_TREES]: {
    leafStages: {
      FERTILIZATION: {
        description: 'เริ่มปลูกหรือหลังตัดแต่งฉีดพ่นเดือนละครั้ง',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_20_7_7,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 60,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.AG]: 40,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          },
          {
            formula: FertilizerFormula.FORMULA_15_14_14,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 80,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      FLOWERING: {
        description: 'ช่วงเร่งติดดอก',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_4_18_18,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NPK_PLUS]: 100,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      FRUIT_DEVELOPMENT: {
        description: 'หลังติดผล บำรุงผล 15 วันในระยะต่อเนื่องจากสูตรเร่งติดดอก',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_13_13_21,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 35,
              [FertilizerType.NPK_PLUS]: 70,
              [FertilizerType.POTASSIUM_PLUS]: 70,
              [FertilizerType.AG]: 30,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      PRE_HARVEST: {
        description: 'ก่อนเก็บผล 1 สัปดาห์ ใช้ปุ๋ยแต่งรสชาติ',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_0_0_28,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.POTASSIUM_PLUS]: 100,
              [FertilizerType.CALCIUM_BORON]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      SOIL_PREP: {
        description: 'การเตรียมดินก่อนปลูกไม้ผล',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 20,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      },
      PLANTED: {
        description: 'กรณีปลูกไม้ผลแล้ว',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      }
    }
  },
  [PlantType.ORCHIDS]: {
    leafStages: {
      REGEN: {
        description: 'ช่วงฟื้นฟูต้น',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_20_7_7,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 60,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      NOURISH: {
        description: 'ช่วงบำรุงต้น',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_15_14_14,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 80,
              [FertilizerType.AG]: 30,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      FLOWERING: {
        description: 'เร่งติดดอก',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_4_18_18,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NPK_PLUS]: 100,
              [FertilizerType.AG]: 30,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      SOIL_PREP: {
        description: 'ไม่มีใช้',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 0
            }
          }
        ]
      }
    }
  },
  [PlantType.FLOWERING_PLANTS]: {
    leafStages: {
      REGEN: {
        description: 'ช่วงติดใบ 5-10 ใบและช่วงฟื้นฟูต้น',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_20_7_7,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 60,
              [FertilizerType.NPK_PLUS]: 40,
              [FertilizerType.AG]: 50,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      NOURISH: {
        description: 'ช่วงบำรุงต้น',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_15_14_14,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 40,
              [FertilizerType.NPK_PLUS]: 80,
              [FertilizerType.AG]: 30,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      },
      FLOWERING: {
        description: 'เร่งติดดอกบำรุงให้ดอกออกต่อเนื่อง',
        fertilizers: [
          {
            formula: FertilizerFormula.FORMULA_9_14_14,
            type: {
              [FertilizerType.APSA_80]: 3,
              [FertilizerType.NITROGEN_PLUS]: 20,
              [FertilizerType.NPK_PLUS]: 80,
              [FertilizerType.AG]: 30,
              [FertilizerType.CALCIUM_BORON]: 30,
              [FertilizerType.ZINC_PLUS]: 40
            }
          }
        ]
      }
    },
    soilStages: {
      SOIL_PREP: {
        description: 'การเตรียมดินก่อนปลูกไม้ดอก',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 20,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      },
      PLANTED: {
        description: 'กรณีปลูกไม้ดอกแล้ว',
        fertilizers: [
          {
            type: {
              [FertilizerType.APSA_80]: 2,
              [FertilizerType.SOIL_PLUS]: 100
            }
          }
        ]
      }
    }
  }
}
