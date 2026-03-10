/*
 *
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *   If not, see <http://www.gnu.org/licenses/>.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 *  SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 *  OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 *  IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import { css } from '@emotion/react';
import { ReactElement } from 'react';

interface LoaderProps {
	message?: string;
}

const Loader = ({ message }: LoaderProps): ReactElement => {
	return (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 20px;
			`}
		>
			<div
				css={css`
					position: relative;
					width: 64px;
					height: 64px;
				`}
			>
				{/* Outer ring — clockwise */}
				<div
					css={css`
						position: absolute;
						inset: 0;
						border-radius: 50%;
						border: 5px solid transparent;
						border-top-color: #003b75;
						border-right-color: #003b75;
						animation: spinCW 1.2s linear infinite;

						@keyframes spinCW {
							0% {
								transform: rotate(0deg);
							}
							100% {
								transform: rotate(360deg);
							}
						}
					`}
				/>
				{/* Inner ring — counter-clockwise */}
				<div
					css={css`
						position: absolute;
						inset: 10px;
						border-radius: 50%;
						border: 4px solid transparent;
						border-top-color: #109ed9;
						border-left-color: #109ed9;
						animation: spinCCW 1.8s linear infinite;

						@keyframes spinCCW {
							0% {
								transform: rotate(0deg);
							}
							100% {
								transform: rotate(-360deg);
							}
						}
					`}
				/>
			</div>

			{message && (
				<p
					css={css`
						font-family: 'Geomanist', sans-serif;
						font-size: 0.95rem;
						font-weight: 700;
						color: #003b75;
						margin: 0;
						letter-spacing: 0.2px;
					`}
				>
					{message}
				</p>
			)}
		</div>
	);
};

export default Loader;
