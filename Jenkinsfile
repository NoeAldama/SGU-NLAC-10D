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

        stage('Limpiando contenedores antiguos SGU') {
            steps {
                echo "Eliminando contenedores antiguos..."
                bat """
                    docker rm -f sgu-database || echo No existía sgu-database
                    docker rm -f sgu-backend || echo No existía sgu-backend
                    docker rm -f sgu-frontend || echo No existía sgu-frontend
                    exit /b 0
                """
            }
        }

        stage('Limpiando imágenes antiguas SGU') {
            steps {
                echo "Eliminando imágenes antiguas SGU..."
                bat """
                    docker rmi -f client:1.0-sgu || echo Imagen client no existía
                    docker rmi -f server:1.0-sgu || echo Imagen server no existía
                    exit /b 0
                """
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
