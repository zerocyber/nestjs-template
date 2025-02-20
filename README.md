# NestJS 기본 템플릿

기본 기능 및 특정 상황별 샘플 템플릿을 미리 준비해놓고 다른 프로젝트에 사용할 목적의 저장소입니다.

DB 연결 정보는 .env 파일에 설정합니다.
만약 원격 서버에 SSH 터널링을 통해 접속하는 경우, 로컬 포트 포워딩을 해주어야 합니다.

호스트 정보를 직접 입력하는 경우
```	bash
$ ssh -L {로컬 DB포트}:localhost:{원격서버 DB포트} {username}@{server-address} -i {SSH_PRIVATE_KEY_PATH} -N
```

SSH config 파일에 호스트 정보를 설정한 경우
``` bash
$ ssh -L {로컬 DB포트}:localhost:{원격서버 DB포트} {config 설정 호스트} -N
```
