pipeline {
    agent any

    stages {

        stage('Parando servicios SGU') {
            steps {
                echo "Deteniendo servicios Docker del proyecto SGU..."
                bat """
                    docker compose -p sgu-project down || exit /b 0
                """
            }
        }

        stage('Limpiando imágenes antiguas SGU') {
            steps {
                echo "Buscando y eliminando imágenes del proyecto sgu-project..."
                bat(label: 'Eliminar imágenes SGU', script: """
                    @echo on
                    for /f "tokens=* delims=" %%i in ('docker images --filter "label=com.docker.compose.project=sgu-project" -q') do (
                        echo Eliminando imagen %%i...
                        docker rmi -f %%i
                    )
                    exit /b 0
                """)
            }
        }

        stage('Obteniendo código del repositorio') {
            steps {
                echo "Descargando código desde SCM..."
                checkout scm
            }
        }

        stage('Construyendo y levantando SGU') {
            steps {
                echo "Construyendo contenedores y levantando servicios SGU..."
                bat """
                    docker compose -p sgu-project up --build -d
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline SGU finalizado correctamente.'
        }
    }
}
