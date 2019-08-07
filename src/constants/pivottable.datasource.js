import spanish from 'flexmonster/es.json'
export const oldReport = {
    report: {
        dataSource: {
            dataSourceType: "json",
            data: [],
        },
        slice: {
            rows: [
                {
                    uniqueName: "Categoria"
                },
                {
                    uniqueName: "Usuario"
                }
            ],
            columns: [
                {
                    uniqueName: "Estatus"
                },
                {
                    uniqueName: "[Measures]"
                }
            ],
            measures: [
                {
                    uniqueName: "NoSolicitud",
                    "aggregation": "count"
                }
            ],
            expands: {
                rows: [
                    {
                        tuple: [
                            "categoria.[acceso a paginas web]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[altas , bajas y cambios]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[aplicaciones office 365]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[bi]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[capital humano]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[comodatos]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[comunicación con his]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[comunicación interhospitalaria]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[conexiones]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[correo electronico]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[enlaces de internet]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[excel]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[facturación / tralix]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[finanzas]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[hoja de resultado]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[impresoras]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[indicadores]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[interfaz con equipo]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[intranet]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[logistica]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[mi equipo]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[mi usuario]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[red inalambrica]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[reportes y estadisticas]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[skype]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[telefonia]"
                        ]
                    },
                    {
                        tuple: [
                            "categoria.[word]"
                        ]
                    }
                ]
            }
        },
        datePattern: "GMT+1:dd-MMMM-yyyy",
        localization: spanish,

    },
    webService: "reporteflexiblea",

}
export const topUsers = {
    report: {
        dataSource: {
            dataSourceType: "json",
            data: [],
        },

        slice: {
            rows: [
                {
                    uniqueName: "Usuario"
                },
                {
                    uniqueName: "Estatus"
                }
            ],
            columns: [
                {
                    uniqueName: "[Measures]"
                }
            ],
            measures: [
                {
                    uniqueName: "Solicitudes",
                    formula: "count(\"NoSolicitud\")",
                    caption: "Solicitudes"
                }
            ],
            sorting: {
                column: {
                    type: "asc",
                    tuple: [],
                    measure: {
                        uniqueName: "Solicitudes",
                        aggregation: "none"
                    }
                }
            }
        },
        options: {
            grid: {
                type: "classic"
            }
        },
        localization: spanish,

    },
    webService: "reporteflextopusuarios"
}
export const statusReport = {
    report: {
        dataSource: {
            dataSourceType: "json",
            data: [],
        },
        localization: spanish,


    },
    webService: "reporteflexsolicitudes"
}
export const ticketsAmount = {
    report: {
        dataSource: {
            dataSourceType: "json",
            data: [],
        },
        slice: {
            rows: [
                {
                    uniqueName: "Usuario",
                    sort: "unsorted"
                },
                {
                    uniqueName: "NoSolicitud",
                    sort: "desc"
                },
                {
                    uniqueName: "Categoria",
                    sort: "unsorted"
                },
                {
                    uniqueName: "Departamento",
                    sort: "unsorted"
                },
                {
                    uniqueName: "FechaAlta.Month",
                    sort: "unsorted"
                },
                {
                    uniqueName: "FechaAlta.Day",
                    sort: "unsorted"
                },
                {
                    uniqueName: "Estatus",
                    sort: "unsorted"
                },
                {
                    uniqueName: "FechaAlta.Year",
                    sort: "unsorted"
                }
            ],
            columns: [
                {
                    uniqueName: "[Measures]"
                }
            ],
            measures: [
                {
                    uniqueName: "NoSolicitud",
                    aggregation: "sum"
                }
            ],
            sorting: {
                column: {
                    type: "desc",
                    tuple: [],
                    measure: {
                        uniqueName: "NoSolicitud",
                        aggregation: "sum"
                    }
                }
            },
            flatOrder: [
                "NoSolicitud",
                "Usuario",
                "Categoria",
                "Departamento",
                "FechaAlta.Month",
                "FechaAlta.Day",
                "Estatus",
                "FechaAlta.Year"
            ]
        },
        options: {
            grid: {
                type: "flat",
                showTotals: "off",
                showGrandTotals: "off"
            }
        },
        localization: spanish,

    },
    webService: "reporteflexsolicitudes"
}